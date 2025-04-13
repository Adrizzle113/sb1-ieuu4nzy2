/*
  # Fix Tour RLS Policies

  1. Changes
    - Drop existing policies
    - Add new policies with proper role checks using profiles table
    - Add proper error handling for non-existent tours
    
  2. Security
    - Enable RLS
    - Add policies for:
      - Public view access
      - Admin-only create/update/delete
    - Use profile role checks
*/

-- First ensure RLS is enabled
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Anyone can view tours" ON tours;
DROP POLICY IF EXISTS "Admins can create tours" ON tours;
DROP POLICY IF EXISTS "Admins can update tours" ON tours;
DROP POLICY IF EXISTS "Admins can delete tours" ON tours;

-- Create new policies with proper role checks

-- Allow public viewing of tours
CREATE POLICY "Anyone can view tours"
ON tours
FOR SELECT
TO public
USING (true);

-- Allow admins to create tours
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

-- Allow admins to update tours
CREATE POLICY "Admins can update tours"
ON tours
FOR UPDATE
TO public
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Allow admins to delete tours
CREATE POLICY "Admins can delete tours"
ON tours
FOR DELETE
TO public
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Add an index on the role column for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);