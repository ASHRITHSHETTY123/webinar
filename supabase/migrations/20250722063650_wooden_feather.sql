/*
# Webinar Hosting System Database Schema

1. New Tables
   - `webinars`
     - `id` (uuid, primary key)
     - `title` (text, not null)
     - `description` (text)
     - `scheduled_at` (timestamptz, not null)
     - `duration` (integer, minutes)
     - `speaker_name` (text, not null)
     - `embed_url` (text)
     - `access_type` (enum: 'public', 'paid_only')
     - `created_by` (uuid, FK to auth.users)
     - `created_at` (timestamptz)
     - `updated_at` (timestamptz)

2. Table Updates
   - Add `is_paid_user` boolean column to auth.users via profiles table

3. Security
   - Enable RLS on webinars table
   - Policies for contributors to manage their own webinars
   - Policies for public users to view public webinars
   - Policies for paid users to view all webinars

4. Enums
   - `access_type_enum` for webinar access levels
*/

-- Create enum for access types
CREATE TYPE access_type_enum AS ENUM ('public', 'paid_only');

-- Create profiles table to extend auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text,
  is_paid_user boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create webinars table
CREATE TABLE IF NOT EXISTS webinars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  scheduled_at timestamptz NOT NULL,
  duration integer DEFAULT 60,
  speaker_name text NOT NULL,
  embed_url text,
  access_type access_type_enum DEFAULT 'public',
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE webinars ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Webinars policies for contributors (creators)
CREATE POLICY "Contributors can manage own webinars"
  ON webinars
  FOR ALL
  TO authenticated
  USING (created_by = auth.uid());

-- Webinars policies for public users (including authenticated)
CREATE POLICY "Anyone can view public webinars"
  ON webinars
  FOR SELECT
  TO authenticated, anon
  USING (access_type = 'public');

-- Webinars policies for paid users
CREATE POLICY "Paid users can view all webinars"
  ON webinars
  FOR SELECT
  TO authenticated
  USING (
    access_type = 'public' OR 
    (access_type = 'paid_only' AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.is_paid_user = true
    ))
  );

-- Function to handle user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insert sample data
INSERT INTO profiles (id, email, is_paid_user) VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'contributor@example.com', false),
  ('550e8400-e29b-41d4-a716-446655440002', 'paid_user@example.com', true),
  ('550e8400-e29b-41d4-a716-446655440003', 'public_user@example.com', false)
ON CONFLICT (id) DO NOTHING;

-- Insert sample webinars
INSERT INTO webinars (title, description, scheduled_at, duration, speaker_name, embed_url, access_type, created_by) VALUES 
  (
    'Introduction to React Development',
    'Learn the basics of React development including components, props, and state management.',
    '2025-02-15 14:00:00+00',
    90,
    'Sarah Johnson',
    'https://player.vimeo.com/video/76979871',
    'public',
    '550e8400-e29b-41d4-a716-446655440001'
  ),
  (
    'Advanced TypeScript Patterns',
    'Deep dive into advanced TypeScript patterns and best practices for enterprise applications.',
    '2025-02-20 16:00:00+00',
    120,
    'Michael Chen',
    'https://player.vimeo.com/video/76979871',
    'paid_only',
    '550e8400-e29b-41d4-a716-446655440001'
  ),
  (
    'Building Scalable APIs',
    'Learn how to design and build scalable APIs using modern architecture patterns.',
    '2025-01-10 15:00:00+00',
    75,
    'Emily Rodriguez',
    'https://player.vimeo.com/video/76979871',
    'public',
    '550e8400-e29b-41d4-a716-446655440001'
  )
ON CONFLICT DO NOTHING;
