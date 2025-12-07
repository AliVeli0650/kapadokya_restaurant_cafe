-- Reorder categories to prioritize main dishes after soups
-- New Order:
-- 1. Soups
-- 2. Grills
-- 3. Double Skewers
-- 4. Pan Dishes
-- 5. Yoghurt Dishes
-- 6. Doner
-- 7. Pide
-- 8. Lahmacun
-- 9. Pizza
-- 10. Fish
-- 11. Warm Starters
-- 12. Cold Starters
-- 13. Salads
-- 14. Kids Menu
-- 15. Pizza Rolls
-- 16. Sides
-- 17. Desserts
-- 18. Cold Drinks
-- 19. Hot Drinks

BEGIN;

UPDATE public.dish_categories SET position = 1 WHERE name_de = 'GÜNÜN ÇORBASI / TÄGLICHE SUPPEN';
UPDATE public.dish_categories SET position = 2 WHERE name_de = 'IZGARA ÇEŞİTLERİ / GRILLSPEZIALITÄTEN';
UPDATE public.dish_categories SET position = 3 WHERE name_de = 'DUBLE ŞİŞLER / DOUBLE SPIEẞ';
UPDATE public.dish_categories SET position = 4 WHERE name_de = 'SAÇ TAVALAR / PFANNENGERICHTE';
UPDATE public.dish_categories SET position = 5 WHERE name_de = 'YOĞURTLULAR / MIT JOGHURT';
UPDATE public.dish_categories SET position = 6 WHERE name_de = 'DÖNER & DÜRÜM';
UPDATE public.dish_categories SET position = 7 WHERE name_de = 'PIDE / TEIGSCHIFFCHEN';
UPDATE public.dish_categories SET position = 8 WHERE name_de = 'LAHMACUN / TÜRKISCHE PIZZA';
UPDATE public.dish_categories SET position = 9 WHERE name_de = 'PIZZA';
UPDATE public.dish_categories SET position = 10 WHERE name_de = 'BALIK / FISCH';
UPDATE public.dish_categories SET position = 11 WHERE name_de = 'ARA SICAKLAR / ZWISCHENSPEISEN';
UPDATE public.dish_categories SET position = 12 WHERE name_de = 'MEZELER / VORSPEISEN';
UPDATE public.dish_categories SET position = 13 WHERE name_de = 'SALATALAR / SALATE';
UPDATE public.dish_categories SET position = 14 WHERE name_de = 'KIDS MENU';
UPDATE public.dish_categories SET position = 15 WHERE name_de = 'PIZZABRÖTCHEN';
UPDATE public.dish_categories SET position = 16 WHERE name_de = 'EXTRA BEILAGEN';
UPDATE public.dish_categories SET position = 17 WHERE name_de = 'TATLI / DESSERTS';
UPDATE public.dish_categories SET position = 18 WHERE name_de = 'İÇECEKLER / KALTE GETRÄNKE';
UPDATE public.dish_categories SET position = 19 WHERE name_de = 'SICAK İÇECEKLER / WARME GETRÄNKE';

COMMIT;
