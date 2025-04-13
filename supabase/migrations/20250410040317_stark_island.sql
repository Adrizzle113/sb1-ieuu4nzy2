/*
  # Update Tours Table RLS Policies

  1. Changes
    - Drop existing ALL policy for admins
    - Create separate policies for each operation (SELECT, INSERT, UPDATE, DELETE)
    - Ensure proper role checking using jwt() -> role
  
  2. Security
    - Maintain existing public read access
    - Add specific policies for admin operations
    - Use proper role checking mechanism
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage tours" ON tours;
DROP POLICY IF EXISTS "Tours are viewable by everyone" ON tours;

-- Recreate policies with proper permissions
CREATE POLICY "Anyone can view tours"
ON tours
FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can create tours"
ON tours
FOR INSERT
TO public
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Admins can update tours"
ON tours
FOR UPDATE
TO public
USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Admins can delete tours"
ON tours
FOR DELETE
TO public
USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);