-- Auto-grant admin role to the first user; subsequent users get no role by default
CREATE OR REPLACE FUNCTION public.handle_first_user_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_first_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_first_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_first_user_admin();

-- Backfill: grant admin to the oldest existing user if no admin exists yet
DO $$
DECLARE
  first_user_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    SELECT id INTO first_user_id FROM auth.users ORDER BY created_at ASC LIMIT 1;
    IF first_user_id IS NOT NULL THEN
      INSERT INTO public.user_roles (user_id, role) VALUES (first_user_id, 'admin')
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
END $$;