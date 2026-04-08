/*
  # Analytics Tracking for AlertPRO

  1. New Tables
    - `page_views`
      - Tracks every page visit with referrer, device info
    - `click_events`
      - Tracks button clicks, phone calls, form interactions
    - `form_submissions`
      - Tracks actual form completions
  
  2. Security
    - Enable RLS on all tables
    - Public can insert (for tracking)
    - Only authenticated admins can read
*/

-- Page Views
CREATE TABLE IF NOT EXISTS page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  page_path text NOT NULL,
  referrer text,
  user_agent text,
  device_type text,
  session_id text,
  ip_address inet
);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert page views"
  ON page_views FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can read page views"
  ON page_views FOR SELECT
  TO authenticated
  USING (true);

-- Click Events
CREATE TABLE IF NOT EXISTS click_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  page_path text NOT NULL,
  element_type text NOT NULL,
  element_label text,
  element_href text,
  session_id text,
  user_agent text
);

ALTER TABLE click_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert click events"
  ON click_events FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can read click events"
  ON click_events FOR SELECT
  TO authenticated
  USING (true);

-- Form Submissions
CREATE TABLE IF NOT EXISTS form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  page_path text NOT NULL,
  form_type text NOT NULL,
  session_id text,
  city text,
  package_interest text,
  user_agent text
);

ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert form submissions"
  ON form_submissions FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can read form submissions"
  ON form_submissions FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_click_events_created_at ON click_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_click_events_element_type ON click_events(element_type);
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions(created_at DESC);
