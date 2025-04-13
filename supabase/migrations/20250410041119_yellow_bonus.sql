/*
  # Update tours table RLS policies

  1. Changes
    - Update the INSERT policy for tours to properly check admin role
    - Policy now joins with profiles table to verify admin role

  2. Security
    - Maintains RLS enabled on tours table
    - Ensures only actual admins can create tours by checking profiles table
*/

DROP POLICY IF EXISTS "Admins can create tours" ON tours;

CREATE POLICY "Admins can create tours"
ON tours
FOR INSERT
TO public
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);