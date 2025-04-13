/*
  # Update admin user metadata

  1. Changes
    - Updates the raw_app_meta_data and raw_user_meta_data for the admin user
    - Sets admin role in both metadata fields
    - Ensures consistent role data across auth and profiles tables

  2. Security
    - Only updates the specific admin user by email
    - Maintains existing user ID and other data
*/

DO $$
BEGIN
  -- Update auth.users metadata
  UPDATE auth.users
  SET 
    raw_app_meta_data = jsonb_build_object(
      'provider', 'email',
      'providers', ARRAY['email'],
      'role', 'admin'
    ),
    raw_user_meta_data = jsonb_build_object(
      'role', 'admin'
    ),
    updated_at = now()
  WHERE email = 'admin@example.com';

  -- Ensure profile role is also set to admin
  UPDATE public.profiles
  SET 
    role = 'admin',
    updated_at = now()
  WHERE email = 'admin@example.com';
END $$;