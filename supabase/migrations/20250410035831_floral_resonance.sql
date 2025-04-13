/*
  # Add itinerary column to tours table

  1. Changes
    - Adds a new JSONB column 'itinerary' to the tours table
    - Column allows NULL values for drafts/incomplete tours
    - Default value is an empty array to ensure valid JSON structure

  2. Security
    - Maintains existing RLS policies
    - No changes to access controls needed
*/

DO $$ 
BEGIN
  -- Add itinerary column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'tours' 
    AND column_name = 'itinerary'
  ) THEN
    ALTER TABLE tours
    ADD COLUMN itinerary JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;