/*
  # Add Activity Icons Support

  1. Changes
    - Add validation function for activity icons
    - Add check constraint to validate icons
    - Update existing activities to include icon field
    
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

-- Add check constraint using the validation function
ALTER TABLE tours
ADD CONSTRAINT itinerary_activities_valid_icon
CHECK (validate_activity_icons(itinerary));

-- Update existing activities to use 'Other' as default icon
UPDATE tours
SET itinerary = (
  SELECT jsonb_agg(
    jsonb_set(
      day,
      '{activities}',
      (
        SELECT jsonb_agg(
          CASE 
            WHEN activity->>'icon' IS NULL 
            THEN jsonb_set(activity, '{icon}', '"Other"'::jsonb)
            ELSE activity
          END
        )
        FROM jsonb_array_elements(day->'activities') activity
      )
    )
  )
  FROM jsonb_array_elements(itinerary) day
)
WHERE itinerary IS NOT NULL;