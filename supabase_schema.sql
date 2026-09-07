-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default locations
INSERT INTO locations (id, name) VALUES
  ('fee', 'FEE-II'),
  ('opps', 'OPPS'),
  ('dbms', 'DBMS'),
  ('dis', 'Discr')
ON CONFLICT (id) DO NOTHING;

-- Create files table
CREATE TABLE IF NOT EXISTS files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  location_id TEXT NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (Assuming anyone can view/upload for now)
-- Locations: everyone can read
CREATE POLICY "Locations are viewable by everyone" ON locations
  FOR SELECT USING (true);

-- Files: everyone can read and insert
CREATE POLICY "Files are viewable by everyone" ON files
  FOR SELECT USING (true);

CREATE POLICY "Files are insertable by everyone" ON files
  FOR INSERT WITH CHECK (true);

-- Create a storage bucket for the files
INSERT INTO storage.buckets (id, name, public) VALUES ('vault_files', 'vault_files', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for the bucket
CREATE POLICY "Public Object Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'vault_files');

CREATE POLICY "Public Object Uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'vault_files');
