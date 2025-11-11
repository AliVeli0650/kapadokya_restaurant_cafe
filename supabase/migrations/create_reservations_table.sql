-- Rezervasyon tablosu oluştur
CREATE TABLE IF NOT EXISTS reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  guests INTEGER NOT NULL CHECK (guests > 0 AND guests <= 50),
  message TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Index oluştur
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON reservations(created_at DESC);

-- RLS (Row Level Security) aktif et
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Admin kullanıcılar için tüm işlemlere izin ver
CREATE POLICY "Admin users can do everything" ON reservations
  FOR ALL
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE email IN (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  ));

-- Herkes rezervasyon oluşturabilir (public form için)
CREATE POLICY "Anyone can insert reservations" ON reservations
  FOR INSERT
  WITH CHECK (true);

-- Updated_at otomatik güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger ekle
CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
