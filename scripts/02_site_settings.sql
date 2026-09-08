-- Create site_settings table for admin profile and site configuration
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default profile settings
INSERT INTO site_settings (setting_key, setting_value) VALUES
  ('profile_name', 'Dflamez Photography'),
  ('profile_email', 'dflameshot@gmail.com'),
  ('profile_phone', '+2348106643611'),
  ('profile_location', 'Lagos + Akure, NG'),
  ('profile_bio', 'Afrocentric Editorial & Fashion Photographer. Celebrating heritage, skin, and style. Available for collabs & travel.'),
  ('profile_website', 'https://dflamezshotz.com'),
  ('profile_instagram', '@dflamez.shotz'),
  ('profile_facebook', 'Dflamez Photography'),
  ('profile_twitter', '@dflamez_shotz')
ON CONFLICT (setting_key) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(setting_key);
