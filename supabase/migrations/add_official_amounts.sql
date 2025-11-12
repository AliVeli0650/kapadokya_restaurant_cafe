-- Gelir ve Gider tablolarına "Resmi Tutar" kolonları ekleme
-- Bu kolonlar vergiye tabi olan resmi tutarları saklayacak

-- Income_transactions tablosuna resmi tutar kolonu ekle
ALTER TABLE income_transactions 
ADD COLUMN IF NOT EXISTS amount_official NUMERIC(10, 2);

-- Expenses tablosuna resmi tutar kolonu ekle
ALTER TABLE expenses 
ADD COLUMN IF NOT EXISTS amount_official NUMERIC(10, 2);

-- Mevcut kayıtlar için, resmi tutar boş ise gerçek tutara eşitle
-- Bu sayede eski kayıtlarda tutarlılık sağlanır
UPDATE income_transactions 
SET amount_official = amount 
WHERE amount_official IS NULL;

UPDATE expenses 
SET amount_official = amount 
WHERE amount_official IS NULL;

-- Yeni kayıtlar için, resmi tutar girilmezse otomatik olarak gerçek tutara eşitlensin
-- Bu, backward compatibility için güvenlik ağı görevi görür
CREATE OR REPLACE FUNCTION set_default_official_amount()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.amount_official IS NULL THEN
    NEW.amount_official := NEW.amount;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Income_transactions için trigger
DROP TRIGGER IF EXISTS income_set_official_amount ON income_transactions;
CREATE TRIGGER income_set_official_amount
  BEFORE INSERT OR UPDATE ON income_transactions
  FOR EACH ROW
  EXECUTE FUNCTION set_default_official_amount();

-- Expenses için trigger
DROP TRIGGER IF EXISTS expenses_set_official_amount ON expenses;
CREATE TRIGGER expenses_set_official_amount
  BEFORE INSERT OR UPDATE ON expenses
  FOR EACH ROW
  EXECUTE FUNCTION set_default_official_amount();

-- Notlar:
-- 1. amount: Gerçek tutar (kasaya giren/çıkan)
-- 2. amount_official: Resmi tutar (vergiye tabi, fatura edilmiş)
-- 3. Fark (amount - amount_official): Vergiye tabi olmayan kısım
