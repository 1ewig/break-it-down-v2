-- Check if an email exists in auth.users
-- Used by the login page to show contextual error messages
-- (e.g. "No account found" vs "Invalid password")

CREATE OR REPLACE FUNCTION public.check_email_exists(p_email text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM auth.users WHERE email = p_email);
$$;
