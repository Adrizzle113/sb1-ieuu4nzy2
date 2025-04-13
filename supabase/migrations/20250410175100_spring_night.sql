/*
  # Add images table for tracking uploaded files

  1. New Tables
    - `images`
      - `id` (uuid, primary key)
      - `url` (text, not null)
      - `file_id` (text, not null)
      - `file_name` (text, not null) 
      - `file_size` (integer, not null)
      - `mime_type` (text, not null)
      - `metadata` (jsonb)
      - `uploaded_at` (timestamptz, not null)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create images table
CREATE TABLE IF NOT EXISTS images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  file_id text NOT NULL,
  file_name text NOT NULL,
  file_size integer NOT NULL,
  mime_type text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  uploaded_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Images are viewable by everyone" 
ON images FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Authenticated users can upload images" 
ON images FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Add updated_at trigger
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON images
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Add indexes
CREATE INDEX idx_images_file_id ON images(file_id);
CREATE INDEX idx_images_uploaded_at ON images(uploaded_at);