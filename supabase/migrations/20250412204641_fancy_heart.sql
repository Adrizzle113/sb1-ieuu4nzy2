/*
  # Add Travel Details and Locations

  1. Updates
    - Add travel_brief JSONB column to tours table
    - Add locations JSONB column to tours table
    - Add validation checks for JSON structure
    - Add indexes for better query performance

  2. Changes
    - Adds new columns with default values
    - Adds check constraints for data validation
    - Creates indexes for performance optimization

  3. Security
    - Maintains existing RLS policies
*/

-- Add travel_brief column with validation
ALTER TABLE tours ADD COLUMN IF NOT EXISTS travel_brief JSONB DEFAULT '{
  "description": null,
  "mapUrl": null,
  "flights": {
    "arrival": null,
    "departure": null,
    "notes": null
  },
  "accommodations": []
}'::jsonb;

-- Add locations column with validation
ALTER TABLE tours ADD COLUMN IF NOT EXISTS locations JSONB DEFAULT '[]'::jsonb;

-- Add check constraints for data validation
ALTER TABLE tours ADD CONSTRAINT travel_brief_is_object 
  CHECK (jsonb_typeof(travel_brief) = 'object');

ALTER TABLE tours ADD CONSTRAINT travel_brief_has_valid_description 
  CHECK (travel_brief->>'description' IS NULL OR jsonb_typeof(travel_brief->'description') = 'string');

ALTER TABLE tours ADD CONSTRAINT travel_brief_has_valid_mapurl 
  CHECK (travel_brief->>'mapUrl' IS NULL OR jsonb_typeof(travel_brief->'mapUrl') = 'string');

ALTER TABLE tours ADD CONSTRAINT travel_brief_has_valid_flights 
  CHECK (travel_brief->'flights' IS NULL OR jsonb_typeof(travel_brief->'flights') = 'object');

ALTER TABLE tours ADD CONSTRAINT travel_brief_has_valid_accommodations 
  CHECK (travel_brief->'accommodations' IS NULL OR jsonb_typeof(travel_brief->'accommodations') = 'array');

ALTER TABLE tours ADD CONSTRAINT locations_is_array 
  CHECK (jsonb_typeof(locations) = 'array');

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tours_travel_brief ON tours USING gin (travel_brief);
CREATE INDEX IF NOT EXISTS idx_tours_locations ON tours USING gin (locations);

-- Add helper functions for working with travel details
CREATE OR REPLACE FUNCTION get_tour_locations(tour_id uuid)
RETURNS jsonb
LANGUAGE sql
STABLE
AS $$
  SELECT locations FROM tours WHERE id = tour_id;
$$;

CREATE OR REPLACE FUNCTION get_tour_travel_brief(tour_id uuid)
RETURNS jsonb
LANGUAGE sql
STABLE
AS $$
  SELECT travel_brief FROM tours WHERE id = tour_id;
$$;

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