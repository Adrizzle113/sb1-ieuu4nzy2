/*
  # Add Travel Details Support
  
  1. New Columns
    - travel_brief JSONB column for storing travel details
    - locations JSONB column for storing location data
  
  2. Validation
    - Added constraints to ensure proper JSON structure
    - Added indexes for performance
*/

-- Add columns if they don't exist
DO $$ 
BEGIN
  -- Add travel_brief column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tours' AND column_name = 'travel_brief'
  ) THEN
    ALTER TABLE tours ADD COLUMN travel_brief JSONB DEFAULT '{
      "description": null,
      "mapUrl": null,
      "flights": {
        "arrival": null,
        "departure": null,
        "notes": null
      },
      "accommodations": []
    }'::jsonb;
  END IF;

  -- Add locations column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tours' AND column_name = 'locations'
  ) THEN
    ALTER TABLE tours ADD COLUMN locations JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Drop existing constraints if they exist
DO $$ 
BEGIN
  -- Drop travel_brief constraints
  IF EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage 
    WHERE table_name = 'tours' AND constraint_name = 'travel_brief_is_object'
  ) THEN
    ALTER TABLE tours DROP CONSTRAINT travel_brief_is_object;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage 
    WHERE table_name = 'tours' AND constraint_name = 'travel_brief_has_valid_description'
  ) THEN
    ALTER TABLE tours DROP CONSTRAINT travel_brief_has_valid_description;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage 
    WHERE table_name = 'tours' AND constraint_name = 'travel_brief_has_valid_mapurl'
  ) THEN
    ALTER TABLE tours DROP CONSTRAINT travel_brief_has_valid_mapurl;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage 
    WHERE table_name = 'tours' AND constraint_name = 'travel_brief_has_valid_flights'
  ) THEN
    ALTER TABLE tours DROP CONSTRAINT travel_brief_has_valid_flights;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage 
    WHERE table_name = 'tours' AND constraint_name = 'travel_brief_has_valid_accommodations'
  ) THEN
    ALTER TABLE tours DROP CONSTRAINT travel_brief_has_valid_accommodations;
  END IF;

  -- Drop locations constraint
  IF EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage 
    WHERE table_name = 'tours' AND constraint_name = 'locations_is_array'
  ) THEN
    ALTER TABLE tours DROP CONSTRAINT locations_is_array;
  END IF;
END $$;

-- Add constraints
ALTER TABLE tours ADD CONSTRAINT travel_brief_is_object 
  CHECK (jsonb_typeof(travel_brief) = 'object');

ALTER TABLE tours ADD CONSTRAINT travel_brief_has_valid_description 
  CHECK ((travel_brief->>'description' IS NULL) OR jsonb_typeof(travel_brief->'description') = 'string');

ALTER TABLE tours ADD CONSTRAINT travel_brief_has_valid_mapurl 
  CHECK ((travel_brief->>'mapUrl' IS NULL) OR jsonb_typeof(travel_brief->'mapUrl') = 'string');

ALTER TABLE tours ADD CONSTRAINT travel_brief_has_valid_flights 
  CHECK ((travel_brief->'flights' IS NULL) OR jsonb_typeof(travel_brief->'flights') = 'object');

ALTER TABLE tours ADD CONSTRAINT travel_brief_has_valid_accommodations 
  CHECK ((travel_brief->'accommodations' IS NULL) OR jsonb_typeof(travel_brief->'accommodations') = 'array');

ALTER TABLE tours ADD CONSTRAINT locations_is_array 
  CHECK (jsonb_typeof(locations) = 'array');

-- Add indexes for better query performance
DROP INDEX IF EXISTS idx_tours_travel_brief;
DROP INDEX IF EXISTS idx_tours_locations;

CREATE INDEX idx_tours_travel_brief ON tours USING gin (travel_brief);
CREATE INDEX idx_tours_locations ON tours USING gin (locations);

-- Update existing tours with default values if needed
UPDATE tours 
SET 
  travel_brief = '{
    "description": null,
    "mapUrl": null,
    "flights": {
      "arrival": null,
      "departure": null,
      "notes": null
    },
    "accommodations": []
  }'::jsonb,
  locations = '[]'::jsonb
WHERE travel_brief IS NULL OR locations IS NULL;