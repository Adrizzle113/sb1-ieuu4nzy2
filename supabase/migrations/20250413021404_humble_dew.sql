/*
  # Update Activity Icons in Itinerary

  1. Changes
    - Add validation function for activity icons
    - Add check constraint for valid icons
    - Update existing activities to include icon field
    - Ensure all activities have a valid icon

  2. Security
    - Maintains existing RLS policies
    - Validates icons against predefined list
*/

-- Create a function to validate activity icons
CREATE OR REPLACE FUNCTION validate_activity_icons(itinerary jsonb)
RETURNS boolean AS $$
DECLARE
  valid_icons text[] := ARRAY[
    'Activity',
    'Destination', 
    'Hotel',
    'Boat',
    'Train',
    'Group Transportation',
    'Check-In',
    'Arrival',
    'Departure',
    'Internal Flight',
    'Transfer',
    'Other'
  ];
  day jsonb;
  activity jsonb;
  icon text;
BEGIN
  -- If itinerary is null or empty array, it's valid
  IF itinerary IS NULL OR jsonb_array_length(itinerary) = 0 THEN
    RETURN true;
  END IF;

  -- Iterate through each day
  FOR day IN SELECT * FROM jsonb_array_elements(itinerary) LOOP
    -- If day has activities
    IF day ? 'activities' AND jsonb_typeof(day->'activities') = 'array' THEN
      -- Check each activity
      FOR activity IN SELECT * FROM jsonb_array_elements(day->'activities') LOOP
        -- Get icon value
        icon := activity->>'icon';
        -- If icon is present, validate it
        IF icon IS NOT NULL AND NOT icon = ANY(valid_icons) THEN
          RETURN false;
        END IF;
      END LOOP;
    END IF;
  END LOOP;

  RETURN true;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Drop existing constraint if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'itinerary_activities_valid_icon'
    AND table_name = 'tours'
  ) THEN
    ALTER TABLE tours DROP CONSTRAINT itinerary_activities_valid_icon;
  END IF;
END $$;

-- Add check constraint using the validation function
ALTER TABLE tours
ADD CONSTRAINT itinerary_activities_valid_icon
CHECK (validate_activity_icons(itinerary));

-- Update existing activities to include icon field
UPDATE tours
SET itinerary = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'location', day->>'location',
      'notes', COALESCE(day->>'notes', ''),
      'details', COALESCE(day->'details', '{}'::jsonb),
      'activities', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'icon', COALESCE(activity->>'icon', 'Other'),
            'description', COALESCE(activity->>'description', ''),
            'duration', COALESCE(activity->>'duration', '')
          )
        )
        FROM jsonb_array_elements(day->'activities') activity
      )
    )
  )
  FROM jsonb_array_elements(itinerary) day
)
WHERE itinerary IS NOT NULL;