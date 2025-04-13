/*
  # Add Inclusions and Exclusions to Tours

  1. New Columns
    - `inclusions` (text array) - List of included items/services
    - `exclusions` (text array) - List of excluded items/services

  2. Changes
    - Add default empty arrays for both columns
    - Add validation constraints
    - Add indexes for better query performance

  3. Security
    - Maintain existing RLS policies
*/

-- Add new columns with default empty arrays
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS inclusions text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS exclusions text[] DEFAULT '{}';

-- Add validation constraints
ALTER TABLE tours
ADD CONSTRAINT inclusions_not_null CHECK (inclusions IS NOT NULL),
ADD CONSTRAINT exclusions_not_null CHECK (exclusions IS NOT NULL);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tours_inclusions ON tours USING gin (inclusions);
CREATE INDEX IF NOT EXISTS idx_tours_exclusions ON tours USING gin (exclusions);

-- Update existing tours with empty arrays if needed
UPDATE tours 
SET 
  inclusions = '{}',
  exclusions = '{}'
WHERE inclusions IS NULL OR exclusions IS NULL;