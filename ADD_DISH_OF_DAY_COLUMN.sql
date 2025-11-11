-- is_dish_of_the_day kolonunu ekle (eğer yoksa)
ALTER TABLE dishes ADD COLUMN IF NOT EXISTS is_dish_of_the_day boolean NOT NULL DEFAULT false;

-- Trigger'ı oluştur
CREATE OR REPLACE FUNCTION ensure_single_dish_of_the_day() RETURNS trigger AS $$
BEGIN
  IF new.is_dish_of_the_day = true THEN
    UPDATE dishes SET is_dish_of_the_day = false WHERE id != new.id AND is_dish_of_the_day = true;
  END IF;
  RETURN new;
END;$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_single_dish_of_day ON dishes;
CREATE TRIGGER trg_single_dish_of_day
BEFORE INSERT OR UPDATE ON dishes
FOR EACH ROW EXECUTE FUNCTION ensure_single_dish_of_the_day();
