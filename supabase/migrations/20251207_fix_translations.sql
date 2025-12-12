-- Fix translations and separate languages
BEGIN;

-- 1) Delete existing dishes and categories
DELETE FROM public.dishes;
DELETE FROM public.dish_categories;

-- 2) Insert categories with clean separated names
INSERT INTO public.dish_categories (name_de, name_tr, position, is_active) VALUES
('TÄGLICHE SUPPEN', 'GÜNÜN ÇORBASI', 1, true),
('GRILLSPEZIALITÄTEN', 'IZGARA ÇEŞİTLERİ', 2, true),
('DOUBLE SPIEẞ', 'DUBLE ŞİŞLER', 3, true),
('PFANNENGERICHTE', 'SAÇ TAVALAR', 4, true),
('MIT JOGHURT', 'YOĞURTLULAR', 5, true),
('DÖNER & DÜRÜM', 'DÖNER & DÜRÜM', 6, true),
('TEIGSCHIFFCHEN', 'PIDE', 7, true),
('TÜRKISCHE PIZZA', 'LAHMACUN', 8, true),
('PIZZA', 'PIZZA', 9, true),
('FISCH', 'BALIK', 10, true),
('ZWISCHENSPEISEN', 'ARA SICAKLAR', 11, true),
('VORSPEISEN', 'MEZELER', 12, true),
('SALATE', 'SALATALAR', 13, true),
('KIDS MENU', 'ÇOCUK MENÜSÜ', 14, true),
('PIZZABRÖTCHEN', 'PIZZA EKMEĞİ', 15, true),
('EXTRA BEILAGEN', 'EKSTRA LEZZETLER', 16, true),
('DESSERTS', 'TATLI', 17, true),
('KALTE GETRÄNKE', 'İÇECEKLER', 18, true),
('WARME GETRÄNKE', 'SICAK İÇECEKLER', 19, true);

-- 3) Insert dishes with corrected translations
INSERT INTO public.dishes (category_id, menu_number, name_tr, name_de, price, description_de, description_tr, raw_details, allergen_codes, is_active, position) VALUES

-- TÄGLICHE SUPPEN
((SELECT id FROM public.dish_categories WHERE name_de='TÄGLICHE SUPPEN'), '01', 'Mercimek Çorbası', 'Linsensuppe', 5.00, NULL, NULL, '', '{}', true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='TÄGLICHE SUPPEN'), '02', 'İşkembe Çorbası', 'Pansensuppe', 6.00, NULL, NULL, '', '{}', true, 2),
((SELECT id FROM public.dish_categories WHERE name_de='TÄGLICHE SUPPEN'), '03', 'Kelle Paça', 'Lammkopfsuppe, Lammzungensuppe', 6.00, NULL, NULL, '', '{}', true, 3),
((SELECT id FROM public.dish_categories WHERE name_de='TÄGLICHE SUPPEN'), '04', 'Tavuk Çorbası', 'Hähnchensuppe', 6.00, NULL, NULL, '', '{}', true, 4),
((SELECT id FROM public.dish_categories WHERE name_de='TÄGLICHE SUPPEN'), '05', 'Kapadokya Karışık Çorba', 'Pansensuppe und Fleischsuppe', 7.00, NULL, NULL, '', '{}', true, 5),

-- SALATE
((SELECT id FROM public.dish_categories WHERE name_de='SALATE'), '25', 'Çoban Salatası', 'Bauernsalat mit Scharfskäse', 7.00, NULL, NULL, '9: mit Milcheiweiß', ARRAY['9'], true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='SALATE'), '26', 'Karışık Salata', 'klein gehackter gemischter Salat', 9.00, NULL, NULL, '', '{}', true, 2),
((SELECT id FROM public.dish_categories WHERE name_de='SALATE'), '27', 'Ton Balığı Salatası', 'Salat mit Thunfisch', 9.00, NULL, NULL, 'f: Thunfisch (9,5%): Wasser, Senf (Senfsaat enthalten), Rapsöl, modifizierte Stärke, Milcheiweiß', ARRAY['f'], true, 3),
((SELECT id FROM public.dish_categories WHERE name_de='SALATE'), '28', 'Tavuklu Salata', 'Salat mit Hähnchenbruststreifen', 13.00, NULL, NULL, '', '{}', true, 4),

-- WARME GETRÄNKE
((SELECT id FROM public.dish_categories WHERE name_de='WARME GETRÄNKE'), '150', 'Küçük Çay', 'Tee klein', 1.00, NULL, NULL, '', '{}', true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='WARME GETRÄNKE'), '151', 'Büyük Çay', 'Tee groß', 2.00, NULL, NULL, '', '{}', true, 2),
((SELECT id FROM public.dish_categories WHERE name_de='WARME GETRÄNKE'), '152', 'Kahve', 'Kaffee', 2.50, NULL, NULL, '', '{}', true, 3),
((SELECT id FROM public.dish_categories WHERE name_de='WARME GETRÄNKE'), '153', 'Espresso', 'Espresso', 2.50, NULL, NULL, '', '{}', true, 4),
((SELECT id FROM public.dish_categories WHERE name_de='WARME GETRÄNKE'), '154', 'Cappuccino', 'Cappuccino', 3.00, NULL, NULL, 'g: Nitritpökelsalz: E250, Antioxidationsmittel, Dextrose, Würze, natürliche Aromen', ARRAY['g'], true, 5),
((SELECT id FROM public.dish_categories WHERE name_de='WARME GETRÄNKE'), '155', 'Latte Macchiato', 'Latte Macchiato', 3.00, NULL, NULL, 'g: Nitritpökelsalz: E250, Antioxidationsmittel, Dextrose, Würze, natürliche Aromen', ARRAY['g'], true, 6),
((SELECT id FROM public.dish_categories WHERE name_de='WARME GETRÄNKE'), '156', 'Türk Kahvesi', 'Türkischer Mokka', 3.00, NULL, NULL, '', '{}', true, 7),
((SELECT id FROM public.dish_categories WHERE name_de='WARME GETRÄNKE'), '157', 'Sıcak Çikolata', 'Heißer Kakao', 3.00, NULL, NULL, '', '{}', true, 8),

-- FISCH
((SELECT id FROM public.dish_categories WHERE name_de='FISCH'), '80', 'Çupra', 'Dorade mit Salat und Reis / Bulgur', 17.00, NULL, NULL, 'f: Thunfisch (9,5%): Wasser, Senf (Senfsaat enthalten), Rapsöl, modifizierte Stärke, Milcheiweiß; k: Bulgur enthält Gluten', ARRAY['f','k'], true, 1),

-- TEIGSCHIFFCHEN
((SELECT id FROM public.dish_categories WHERE name_de='TEIGSCHIFFCHEN'), '85', 'Kaşarlı Pide', 'Teigschiffchen mit Goudakäse', 8.00, 'Extra Ei 1€', NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; g: Nitritpökelsalz: E250, Antioxidationsmittel, Dextrose, Würze, natürliche Aromen; i: Elmalta-Erzeugnisse: Stärkesirup, Fruchtmark (Aprikose, Pfirsich), Trinkwasser, Zucker, Branntweinessig, modifizierte Maisstärke, SOJASAUCE (Wasser, SOJABOHNEN, WEIZEN, Salz), Salz, Rapsöl, Ananassaftkonzentrat, Essigsäure(E260), Gewürze (Sellerie), Verdickungsmittel (E415), Karamell', ARRAY['a','g','i'], true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='TEIGSCHIFFCHEN'), '86', 'Sucuklu Pide', 'Teigschiffchen mit Knoblauchwurst und Goudakäse', 9.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; g: Nitritpökelsalz: E250, Antioxidationsmittel, Dextrose, Würze, natürliche Aromen; i: Elmalta-Erzeugnisse...; c: Rindfleisch(Döner)-Zutaten: Kalbfleisch, Putenfleisch, Weizenmehl, Trinkwasser, Schweinelt, Speisalz, Gewürze (Sellerie), Geschmacksverstärker E621, Stabilisatore E451...', ARRAY['a','g','i','c'], true, 2),
((SELECT id FROM public.dish_categories WHERE name_de='TEIGSCHIFFCHEN'), '87', 'Kıymalı Pide', 'Teigschiffchen mit Rinderhackfleisch', 9.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz', ARRAY['a'], true, 3),
((SELECT id FROM public.dish_categories WHERE name_de='TEIGSCHIFFCHEN'), '88', 'Ispanaklı Pide', 'Teigschiffchen mit Spinat, Zwiebel und Goudakäse', 9.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; g: Nitritpökelsalz: E250, Antioxidationsmittel, Dextrose, Würze, natürliche Aromen', ARRAY['a','g'], true, 4),
((SELECT id FROM public.dish_categories WHERE name_de='TEIGSCHIFFCHEN'), '89', 'Vejetaryen Pide', 'Teigschiffchen mit Gemüse', 9.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz', ARRAY['a'], true, 5),
((SELECT id FROM public.dish_categories WHERE name_de='TEIGSCHIFFCHEN'), '90', 'Dönerli Pide', 'Teigschiffchen mit Döner und Goudakäse', 10.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; c: Rindfleisch(Döner)-Zutaten: Kalbfleisch, Putenfleisch...; g: Nitritpökelsalz: E250, Antioxidationsmittel, Dextrose, Würze, natürliche Aromen', ARRAY['a','c','g'], true, 6),
((SELECT id FROM public.dish_categories WHERE name_de='TEIGSCHIFFCHEN'), '91', 'Kuşbaşılı Pide', 'Teigschiffchen mit geschnitzeltem Fleisch', 10.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; c: Rindfleisch(Döner)-Zutaten...; g: Nitritpökelsalz: E250...; i: Elmalta-Erzeugnisse...', ARRAY['a','c','g','i'], true, 7),
((SELECT id FROM public.dish_categories WHERE name_de='TEIGSCHIFFCHEN'), '92', 'Karışık Pide', 'gemischtes Teigschiffchen', 12.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; c: Rindfleisch(Döner)-Zutaten...; g: Nitritpökelsalz: E250...; i: Elmalta-Erzeugnisse...', ARRAY['a','c','g','i'], true, 8),

-- KIDS MENU
((SELECT id FROM public.dish_categories WHERE name_de='KIDS MENU'), '110', 'Patates Kızartması', 'Pommes', 4.00, NULL, NULL, '16: Pommes: Antioxidationsmittel: Ascorbinsäure, Würze und Aromen.modifizierte Stärke, Dextrose.', ARRAY['16'], true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='KIDS MENU'), '111', 'Nugget (6 Adet)', 'Nuggets (6 Stück) mit Pommes', 7.00, NULL, NULL, '', '{}', true, 2),
((SELECT id FROM public.dish_categories WHERE name_de='KIDS MENU'), '112', 'Çocuk Döner', 'Kinder Döner mit Pommes', 8.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; c: Rindfleisch(Döner)-Zutaten: Kalbfleisch, Putenfleisch...', ARRAY['a','c'], true, 3),
((SELECT id FROM public.dish_categories WHERE name_de='KIDS MENU'), '113', 'Çocuk Tavuk Şiş', 'Kinder Hähnchenspieß mit Pommes', 9.00, NULL, NULL, '16: Pommes: Antioxidationsmittel: Ascorbinsäure, Würze und Aromen.modifizierte Stärke, Dextrose.', ARRAY['16'], true, 4),
((SELECT id FROM public.dish_categories WHERE name_de='KIDS MENU'), '114', 'Çocuk Köfte', 'Kinder Frikadelle mit Pommes', 9.00, NULL, NULL, '16: Pommes: Antioxidationsmittel: Ascorbinsäure, Würze und Aromen.modifizierte Stärke, Dextrose.', ARRAY['16'], true, 5),
((SELECT id FROM public.dish_categories WHERE name_de='KIDS MENU'), NULL, 'Çocuk Hamburger + Patates', 'Kinder-Hamburger + Pommes', 11.99, NULL, NULL, '', '{}', true, 6),

-- DESSERTS
((SELECT id FROM public.dish_categories WHERE name_de='DESSERTS'), '125', 'Künefe', 'Fadennudeln mit Käse gebacken, Sahne, Pistazien in Zuckersirup', 7.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; g: Nitritpökelsalz: E250...; i: Elmalta-Erzeugnisse...; l: Nüsse, Walnüsse, Pistazien', ARRAY['a','g','i','l'], true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='DESSERTS'), '126', 'Baklava', 'Süsser Sauce in Zuckersirup', 6.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz', ARRAY['a'], true, 2),
((SELECT id FROM public.dish_categories WHERE name_de='DESSERTS'), '127', 'Katmer', 'Blätterteig mit gehackten Wallnüsse, Pistazien in Zuckersirup', 7.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; l: Nüsse, Walnüsse, Pistazien', ARRAY['a','l'], true, 3),
((SELECT id FROM public.dish_categories WHERE name_de='DESSERTS'), '128', 'Sütlaç', 'Milchreis', 5.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; l: Nüsse, Walnüsse, Pistazien', ARRAY['a','l'], true, 4),

-- KALTE GETRÄNKE
((SELECT id FROM public.dish_categories WHERE name_de='KALTE GETRÄNKE'), '130', 'Maden Suyu (Küçük)', 'Mineralwasser klein (0,2 l)', 2.00, NULL, NULL, '', '{}', true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='KALTE GETRÄNKE'), '132', 'Su', 'Wasser (0,5 l)', 2.00, NULL, NULL, '', '{}', true, 2),
((SELECT id FROM public.dish_categories WHERE name_de='KALTE GETRÄNKE'), '134', 'Ayran', 'Ayran (0,2 l)', 2.00, NULL, NULL, 'g: Nitritpökelsalz: E250, Antioxidationsmittel, Dextrose, Würze, natürliche Aromen', ARRAY['g'], true, 3),
((SELECT id FROM public.dish_categories WHERE name_de='KALTE GETRÄNKE'), '135', 'Coca Cola', 'Coca Cola (0,2l)', 2.50, NULL, NULL, '1: beinhaltet Zusatzstoffe; 3: mit Antixodationsmittel; 5: koffeeinhaltig', ARRAY['1','3','5'], true, 4),
((SELECT id FROM public.dish_categories WHERE name_de='KALTE GETRÄNKE'), '136', 'Cola Zero', 'Cola Zero (0,2l)', 2.50, NULL, NULL, '1: beinhaltet Zusatzstoffe; 3: mit Antixodationsmittel; 5: koffeeinhaltig; 6: mit Süßungsmittel; 7: enthält eine Phenylalinquelle', ARRAY['1','3','5','6','7'], true, 5),
((SELECT id FROM public.dish_categories WHERE name_de='KALTE GETRÄNKE'), '137', 'Fanta', 'Fanta (0,2l)', 2.50, NULL, NULL, '1: beinhaltet Zusatzstoffe; 3: mit Antixodationsmittel', ARRAY['1','3'], true, 6),
((SELECT id FROM public.dish_categories WHERE name_de='KALTE GETRÄNKE'), '138', 'Sprite', 'Sprite (0,2L)', 2.50, NULL, NULL, '3: mit Antixodationsmittel', ARRAY['3'], true, 7),
((SELECT id FROM public.dish_categories WHERE name_de='KALTE GETRÄNKE'), '139', 'Bitter Lemon', 'Bitter Lemon (0,2 l)', 2.50, NULL, NULL, '14: Chininhaltig; 15: Säurungsregulatoren', ARRAY['14','15'], true, 8),
((SELECT id FROM public.dish_categories WHERE name_de='KALTE GETRÄNKE'), '140', 'Ginger Ale', 'Ginger Ale (0,2 l)', 2.50, NULL, NULL, '1: beinhaltet Zusatzstoffe', ARRAY['1'], true, 9),
((SELECT id FROM public.dish_categories WHERE name_de='KALTE GETRÄNKE'), '141', 'Soğuk Çay', 'Eistee (0,2 l)', 2.50, NULL, NULL, '', '{}', true, 10),
((SELECT id FROM public.dish_categories WHERE name_de='KALTE GETRÄNKE'), '142', 'Elma Suyu', 'Apfelsaft Schorle (0,2l)', 2.50, NULL, NULL, '2: mit Konservierungsstoff', ARRAY['2'], true, 11),
((SELECT id FROM public.dish_categories WHERE name_de='KALTE GETRÄNKE'), '143', 'Uludağ Gazoz', 'Uludag (0,33l)', 2.50, NULL, NULL, '3: mit Antixodationsmittel; 6: mit Süßungsmittel', ARRAY['3','6'], true, 12),
((SELECT id FROM public.dish_categories WHERE name_de='KALTE GETRÄNKE'), '144', 'Mezzo Mix', 'Mezzo Mix (0,2 l)', 2.50, NULL, NULL, '1: beinhaltet Zusatzstoffe; 3: mit Antixodationsmittel; 5: koffeeinhaltig', ARRAY['1','3','5'], true, 13),

-- VORSPEISEN
((SELECT id FROM public.dish_categories WHERE name_de='VORSPEISEN'), '10', 'Karışık Meze Tabağı (Büyük)', 'Vorspeisenteller (groß)', 14.00, NULL, NULL, '', '{}', true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='VORSPEISEN'), '11', 'Karışık Meze Tabağı (Küçük)', 'Vorspeisenteller (klein)', 12.00, NULL, NULL, '', '{}', true, 2),
((SELECT id FROM public.dish_categories WHERE name_de='VORSPEISEN'), '12', 'Haydari', 'Haydari', 6.00, NULL, NULL, '9: mit Milcheiweiß', ARRAY['9'], true, 3),
((SELECT id FROM public.dish_categories WHERE name_de='VORSPEISEN'), '13', 'Antep Ezme', 'Antep Ezme', 6.00, NULL, NULL, '', '{}', true, 4),

-- ZWISCHENSPEISEN
((SELECT id FROM public.dish_categories WHERE name_de='ZWISCHENSPEISEN'), '15', 'Sigara Böreği', 'Sigara Böreği', 7.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; 9: mit Milcheiweiß', ARRAY['a','9'], true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='ZWISCHENSPEISEN'), '16', 'Mantar Şiş', 'Mantar Şiş', 8.00, NULL, NULL, '', '{}', true, 2),

-- TÜRKISCHE PIZZA
((SELECT id FROM public.dish_categories WHERE name_de='TÜRKISCHE PIZZA'), '20', 'Lahmacun', 'Lahmacun', 3.50, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; b: Pizza / Türkische Pizza / Pide: Weizenmehl, Gluten, Hefe, Milch, Ei, Zucker und Salz', ARRAY['a','b'], true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='TÜRKISCHE PIZZA'), '21', 'Lahmacun (Salatalı)', 'Lahmacun mit Salat', 5.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; b: Pizza / Türkische Pizza / Pide: Weizenmehl, Gluten, Hefe, Milch, Ei, Zucker und Salz', ARRAY['a','b'], true, 2),
((SELECT id FROM public.dish_categories WHERE name_de='TÜRKISCHE PIZZA'), '22', 'Lahmacun (Dönerli)', 'Lahmacun mit Döner und Salat', 8.50, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; c: Rindfleisch(Döner)-Zutaten: Kalbfleisch, Putenfleisch...; b: Pizza / Türkische Pizza / Pide: Weizenmehl, Gluten, Hefe, Milch, Ei, Zucker und Salz', ARRAY['a','b','c'], true, 3),
((SELECT id FROM public.dish_categories WHERE name_de='TÜRKISCHE PIZZA'), '22', 'Balon Ekmek (Ekstra)', 'Balon Brot Extra', 2.00, NULL, NULL, '', '{}', true, 4),

-- GRILLSPEZIALITÄTEN
((SELECT id FROM public.dish_categories WHERE name_de='GRILLSPEZIALITÄTEN'), '30', 'Adana Kebap', 'Adana Kebab', 16.00, NULL, NULL, 'k: Bulgur enthält Gluten', ARRAY['k'], true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='GRILLSPEZIALITÄTEN'), '31', 'Urfa Kebap', 'Urfa Kebab', 16.00, NULL, NULL, 'k: Bulgur enthält Gluten', ARRAY['k'], true, 2),
((SELECT id FROM public.dish_categories WHERE name_de='GRILLSPEZIALITÄTEN'), '32', 'Kuzu Şiş', 'Lammspieß', 18.00, NULL, NULL, 'k: Bulgur enthält Gluten', ARRAY['k'], true, 3),
((SELECT id FROM public.dish_categories WHERE name_de='GRILLSPEZIALITÄTEN'), '33', 'Tavuk Şiş', 'Hähnchenspieß', 14.00, NULL, NULL, 'k: Bulgur enthält Gluten', ARRAY['k'], true, 4),
((SELECT id FROM public.dish_categories WHERE name_de='GRILLSPEZIALITÄTEN'), '34', 'Köfte Tabağı', 'Köfte Teller', 14.00, NULL, NULL, 'k: Bulgur enthält Gluten', ARRAY['k'], true, 5),
((SELECT id FROM public.dish_categories WHERE name_de='GRILLSPEZIALITÄTEN'), '35', 'Tavuk Kanat', 'Hähnchenflügel', 14.00, NULL, NULL, 'k: Bulgur enthält Gluten', ARRAY['k'], true, 6),
((SELECT id FROM public.dish_categories WHERE name_de='GRILLSPEZIALITÄTEN'), '36', 'Kuzu Pirzola', 'Lammkotelett', 20.00, NULL, NULL, 'k: Bulgur enthält Gluten', ARRAY['k'], true, 7),
((SELECT id FROM public.dish_categories WHERE name_de='GRILLSPEZIALITÄTEN'), '37', 'Kuzu Kaburga', 'Lammrippen', 19.00, NULL, NULL, 'k: Bulgur enthält Gluten', ARRAY['k'], true, 8),
((SELECT id FROM public.dish_categories WHERE name_de='GRILLSPEZIALITÄTEN'), '38', 'Karışık Izgara', 'Gemischte Grillplatte', 22.00, NULL, NULL, 'k: Bulgur enthält Gluten', ARRAY['k'], true, 9),
((SELECT id FROM public.dish_categories WHERE name_de='GRILLSPEZIALITÄTEN'), '45', 'Karışık Izgara (2 Kişilik)', 'Grillplatte für 2 Personen', 41.00, NULL, NULL, 'k: Bulgur enthält Gluten; c: Rindfleisch(Döner)-Zutaten: Kalbfleisch, Putenfleisch...', ARRAY['k','c'], true, 10),
((SELECT id FROM public.dish_categories WHERE name_de='GRILLSPEZIALITÄTEN'), '46', 'Karışık Izgara (3 Kişilik)', 'Grillplatte für 3 Personen', 60.00, NULL, NULL, 'k: Bulgur enthält Gluten; c: Rindfleisch(Döner)-Zutaten: Kalbfleisch, Putenfleisch...', ARRAY['k','c'], true, 11),
((SELECT id FROM public.dish_categories WHERE name_de='GRILLSPEZIALITÄTEN'), '47', 'Karışık Izgara (4 Kişilik)', 'Grillplatte für 4 Personen', 80.00, NULL, NULL, 'k: Bulgur enthält Gluten; c: Rindfleisch(Döner)-Zutaten: Kalbfleisch, Putenfleisch...', ARRAY['k','c'], true, 12),
((SELECT id FROM public.dish_categories WHERE name_de='GRILLSPEZIALITÄTEN'), '48', 'Kapadokya Tabağı (5 Kişilik)', 'Kapadokya Platte (5 Personen)', 99.00, NULL, NULL, 'k: Bulgur enthält Gluten; c: Rindfleisch(Döner)-Zutaten: Kalbfleisch, Putenfleisch...', ARRAY['k','c'], true, 13),

-- MIT JOGHURT
((SELECT id FROM public.dish_categories WHERE name_de='MIT JOGHURT'), '50', 'Yoğurtlu Adana', 'Adana Kebab Yoğurtlu', 18.00, NULL, NULL, 'g: Nitritpökelsalz: E250...; a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; k: Bulgur enthält Gluten', ARRAY['g','a','k'], true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='MIT JOGHURT'), '51', 'Beyti Sarma', 'Beyti Sarma', 18.00, NULL, NULL, 'g: Nitritpökelsalz: E250...; a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; k: Bulgur enthält Gluten', ARRAY['g','a','k'], true, 2),
((SELECT id FROM public.dish_categories WHERE name_de='MIT JOGHURT'), '52', 'Ali Nazik', 'Ali Nazik', 20.00, NULL, NULL, 'g: Nitritpökelsalz: E250...; a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; k: Bulgur enthält Gluten', ARRAY['g','a','k'], true, 3),
((SELECT id FROM public.dish_categories WHERE name_de='MIT JOGHURT'), '53', 'Döner Beyti', 'Döner Beyti', 16.00, NULL, NULL, 'g: Nitritpökelsalz: E250...; a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; k: Bulgur enthält Gluten', ARRAY['g','a','k'], true, 4),

-- DOUBLE SPIEẞ
((SELECT id FROM public.dish_categories WHERE name_de='DOUBLE SPIEẞ'), '55', 'Duble Adana', 'Adana Kebab (doppelt)', 25.00, NULL, NULL, 'k: Bulgur enthält Gluten', ARRAY['k'], true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='DOUBLE SPIEẞ'), '56', 'Kuzu Şiş & Adana', 'Lammspieß und Adana', 28.00, NULL, NULL, 'k: Bulgur enthält Gluten', ARRAY['k'], true, 2),
((SELECT id FROM public.dish_categories WHERE name_de='DOUBLE SPIEẞ'), '57', 'Adana & Tavuk Şiş', 'Adana und Hähnchenspieß', 25.00, NULL, NULL, 'k: Bulgur enthält Gluten', ARRAY['k'], true, 3),

-- PFANNENGERICHTE
((SELECT id FROM public.dish_categories WHERE name_de='PFANNENGERICHTE'), '60', 'Kuzu Saç Tava', 'Lammfleisch Pfanne', 17.00, NULL, NULL, 'k: Bulgur enthält Gluten', ARRAY['k'], true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='PFANNENGERICHTE'), '61', 'Tavuk Saç Tava', 'Hähnchenfleisch Pfanne', 15.00, NULL, NULL, 'k: Bulgur enthält Gluten', ARRAY['k'], true, 2),
((SELECT id FROM public.dish_categories WHERE name_de='PFANNENGERICHTE'), '62', 'Sebze Saç Tava', 'Gemüsepfanne', 13.00, NULL, NULL, 'k: Bulgur enthält Gluten', ARRAY['k'], true, 3),

-- DÖNER & DÜRÜM
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '65', 'Döner Ekmek Arası (Tavuk)', 'Dönertasche (Hähnchen)', 6.00, NULL, NULL, 'k: Bulgur enthält Gluten; c: Rindfleisch(Döner)-Zutaten...; 16: Pommes: Antioxidationsmittel: Ascorbinsäure, Würze und Aromen.modifizierte Stärke, Dextrose.', ARRAY['k','c','16'], true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '66', 'Döner Tabağı Küçük (Tavuk)', 'Dönerteller klein (Hähnchen)', 10.00, NULL, NULL, 'k: Bulgur enthält Gluten; c: Rindfleisch(Döner)-Zutaten...; 16: Pommes: Antioxidationsmittel: Ascorbinsäure, Würze und Aromen.modifizierte Stärke, Dextrose.', ARRAY['k','c','16'], true, 2),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '67', 'Döner Tabağı Büyük (Tavuk)', 'Dönerteller groß (Hähnchen)', 12.00, NULL, NULL, 'k: Bulgur enthält Gluten; c: Rindfleisch(Döner)-Zutaten...; 16: Pommes: Antioxidationsmittel: Ascorbinsäure, Würze und Aromen.modifizierte Stärke, Dextrose.', ARRAY['k','c','16'], true, 3),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '68', 'Döner Dürüm (Tavuk)', 'Döner Dürüm (Hähnchen)', 7.00, NULL, NULL, 'k: Bulgur enthält Gluten; c: Rindfleisch(Döner)-Zutaten...; 16: Pommes: Antioxidationsmittel: Ascorbinsäure, Würze und Aromen.modifizierte Stärke, Dextrose.', ARRAY['k','c','16'], true, 4),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '69', 'Döner Ekmek Arası (Dana)', 'Dönertasche (Kalb)', 7.00, NULL, NULL, 'k: Bulgur enthält Gluten; c: Rindfleisch(Döner)-Zutaten...; 16: Pommes: Antioxidationsmittel: Ascorbinsäure, Würze und Aromen.modifizierte Stärke, Dextrose.', ARRAY['k','c','16'], true, 5),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '70', 'Döner Tabağı Küçük (Dana)', 'Dönerteller klein (Kalb)', 11.00, NULL, NULL, 'k: Bulgur enthält Gluten; c: Rindfleisch(Döner)-Zutaten...; 16: Pommes: Antioxidationsmittel: Ascorbinsäure, Würze und Aromen.modifizierte Stärke, Dextrose.', ARRAY['k','c','16'], true, 6),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '71', 'Döner Tabağı Büyük (Dana)', 'Dönerteller groß (Kalb)', 13.00, NULL, NULL, 'k: Bulgur enthält Gluten; c: Rindfleisch(Döner)-Zutaten...; 16: Pommes: Antioxidationsmittel: Ascorbinsäure, Würze und Aromen.modifizierte Stärke, Dextrose.', ARRAY['k','c','16'], true, 7),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '72', 'İskender', 'İskender', 16.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; g: Nitritpökelsalz: E250...; c: Rindfleisch(Döner)-Zutaten...', ARRAY['a','g','c'], true, 8),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '73', 'Döner Dürüm (Dana)', 'Döner Dürüm (Kalb)', 8.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; c: Rindfleisch(Döner)-Zutaten...; 9: mit Milcheiweiß', ARRAY['a','c','9'], true, 9),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '74', 'Döner Dürüm Büyük (Dana)', 'Döner Dürüm groß (Kalb)', 10.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; g: Nitritpökelsalz: E250...', ARRAY['a','g'], true, 10),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '75', 'Döner Box', 'Döner Box', 7.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; c: Rindfleisch(Döner)-Zutaten...', ARRAY['a','c'], true, 11),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '76', 'Adana Dürüm', 'Adana Dürüm', 8.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; 9: mit Milcheiweiß', ARRAY['a','9'], true, 12),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '77', 'Adana Dürüm Büyük', 'Adana Dürüm groß', 10.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; 9: mit Milcheiweiß', ARRAY['a','9'], true, 13),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '78', 'Kuzu Şiş Dürüm', 'Lammspieß Dürüm', 10.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; 9: mit Milcheiweiß', ARRAY['a','9'], true, 14),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '79', 'Kuzu Şiş Dürüm Büyük', 'Lammspieß Dürüm groß', 12.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; 9: mit Milcheiweiß', ARRAY['a','9'], true, 15),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '80', 'Tavuk Şiş Dürüm', 'Hähnchenspieß Dürüm', 8.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; 9: mit Milcheiweiß', ARRAY['a','9'], true, 16),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '81', 'Tavuk Şiş Dürüm Büyük', 'Hähnchenspieß Dürüm groß', 10.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; 9: mit Milcheiweiß', ARRAY['a','9'], true, 17),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '82', 'Falafel Dürüm', 'Falafel Dürüm', 9.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; 9: mit Milcheiweiß; k: Bulgur enthält Gluten', ARRAY['a','9','k'], true, 18),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '83', 'Falafel Tabağı', 'Falafel Teller', 12.00, NULL, NULL, '', '{}', true, 19),

-- PIZZA
((SELECT id FROM public.dish_categories WHERE name_de='PIZZA'), '95', 'Margarita', 'Margherita', 7.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; g: Nitritpökelsalz: E250...', ARRAY['a','g'], true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='PIZZA'), '96', 'Ton Balıklı Pizza', 'Pizza Tonno', 9.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; g: Nitritpökelsalz: E250...; f: Thunfisch (9,5%): Wasser, Senf (Senfsaat enthalten)...', ARRAY['a','g','f'], true, 2),
((SELECT id FROM public.dish_categories WHERE name_de='PIZZA'), '97', 'Dönerli Pizza', 'Pizza Döner', 10.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; g: Nitritpökelsalz: E250...; c: Rindfleisch(Döner)-Zutaten...', ARRAY['a','g','c'], true, 3),
((SELECT id FROM public.dish_categories WHERE name_de='PIZZA'), '98', 'Sucuklu Pizza', 'Pizza Sucuk', 10.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; g: Nitritpökelsalz: E250...; c: Rindfleisch(Döner)-Zutaten...', ARRAY['a','g','c'], true, 4),
((SELECT id FROM public.dish_categories WHERE name_de='PIZZA'), '99', 'Vejetaryen Pizza', 'Pizza Vegetarisch', 10.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz', ARRAY['a'], true, 5),
((SELECT id FROM public.dish_categories WHERE name_de='PIZZA'), '100', 'Kapadokya Pizza', 'Pizza Kapadokya', 10.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; c: Rindfleisch(Döner)-Zutaten...', ARRAY['a','c'], true, 6),
((SELECT id FROM public.dish_categories WHERE name_de='PIZZA'), '101', 'Mantarlı Pizza', 'Pizza Funghi', 9.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; g: Nitritpökelsalz: E250...', ARRAY['a','g'], true, 7),

-- PIZZABRÖTCHEN
((SELECT id FROM public.dish_categories WHERE name_de='PIZZABRÖTCHEN'), '105', 'Kaşarlı Pizza Ekmeği', 'Gefüllte Pizzabrötchen mit Käse', 6.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; g: Nitritpökelsalz: E250...', ARRAY['a','g'], true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='PIZZABRÖTCHEN'), '106', 'Ton Balıklı Pizza Ekmeği', 'Gefüllte Pizzabrötchen mit Thunfisch', 8.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; g: Nitritpökelsalz: E250...; f: Thunfisch (9,5%): Wasser, Senf (Senfsaat enthalten)...', ARRAY['a','g','f'], true, 2),
((SELECT id FROM public.dish_categories WHERE name_de='PIZZABRÖTCHEN'), '107', 'Tavuklu Pizza Ekmeği', 'Gefüllte Pizzabrötchen mit Hähnchenbrust', 8.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; g: Nitritpökelsalz: E250...', ARRAY['a','g'], true, 3),
((SELECT id FROM public.dish_categories WHERE name_de='PIZZABRÖTCHEN'), '108', 'Sucuklu Pizza Ekmeği', 'Gefüllte Pizzabrötchen mit türkischer Knoblauchwurst', 8.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; g: Nitritpökelsalz: E250...; c: Rindfleisch(Döner)-Zutaten...', ARRAY['a','g','c'], true, 4),
((SELECT id FROM public.dish_categories WHERE name_de='PIZZABRÖTCHEN'), '109', 'Dönerli Pizza Ekmeği', 'Gefüllte Pizzabrötchen mit Döner', 8.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; g: Nitritpökelsalz: E250...; c: Rindfleisch(Döner)-Zutaten...', ARRAY['a','g','c'], true, 5),

-- EXTRA BEILAGEN
((SELECT id FROM public.dish_categories WHERE name_de='EXTRA BEILAGEN'), '115', 'Pirinç Pilavı', 'Reis Portion', 4.00, NULL, NULL, '', '{}', true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='EXTRA BEILAGEN'), '116', 'Bulgur Pilavı', 'Bulgur Portion', 4.00, NULL, NULL, 'k: Bulgur enthält Gluten', ARRAY['k'], true, 2),
((SELECT id FROM public.dish_categories WHERE name_de='EXTRA BEILAGEN'), '117', 'Patates Kızartması', 'Pommes', 4.00, NULL, NULL, '16: Pommes: Antioxidationsmittel: Ascorbinsäure, Würze und Aromen.modifizierte Stärke, Dextrose.', ARRAY['16'], true, 3),
((SELECT id FROM public.dish_categories WHERE name_de='EXTRA BEILAGEN'), '118', 'Ekstra Pirzola', 'Extra Pirzola', 4.00, NULL, NULL, '', '{}', true, 4),
((SELECT id FROM public.dish_categories WHERE name_de='EXTRA BEILAGEN'), '119', 'Ekstra Köfte', 'Extra Köfte', 3.00, NULL, NULL, '', '{}', true, 5),
((SELECT id FROM public.dish_categories WHERE name_de='EXTRA BEILAGEN'), '120', 'Ketçap', 'Ketchup', 1.00, NULL, NULL, '19: Ketchup: 81% Tomatenmark, Zucker, Branntweinessig*, modifizierte Stärke, Speisesalz, Verdickungsmittel Guarkernmehl, Gewürze, Säuerungsmittel: Citronensäure.', ARRAY['19'], true, 6),
((SELECT id FROM public.dish_categories WHERE name_de='EXTRA BEILAGEN'), '121', 'Mayonez', 'Mayonnaise', 1.00, NULL, NULL, '17: Mayonnaise: (enthält Senfsaat), Milcheiweiß, Dextrose.', ARRAY['17'], true, 7);

COMMIT;
