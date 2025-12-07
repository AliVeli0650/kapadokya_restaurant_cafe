-- Complete Menu Seed - Replace all existing categories and dishes with CSV data
BEGIN;

-- 1) Delete existing dishes and categories (cascade will handle foreign keys)
DELETE FROM public.dishes;
DELETE FROM public.dish_categories;

-- 2) Insert categories in order
INSERT INTO public.dish_categories (name_de, name_tr, position, is_active) VALUES
('GÜNÜN ÇORBASI / TÄGLICHE SUPPEN', 'GÜNÜN ÇORBASI / TÄGLICHE SUPPEN', 1, true),
('IZGARA ÇEŞİTLERİ / GRILLSPEZIALITÄTEN', 'IZGARA ÇEŞİTLERİ / GRILLSPEZIALITÄTEN', 2, true),
('DUBLE ŞİŞLER / DOUBLE SPIEẞ', 'DUBLE ŞİŞLER / DOUBLE SPIEẞ', 3, true),
('SAÇ TAVALAR / PFANNENGERICHTE', 'SAÇ TAVALAR / PFANNENGERICHTE', 4, true),
('YOĞURTLULAR / MIT JOGHURT', 'YOĞURTLULAR / MIT JOGHURT', 5, true),
('DÖNER & DÜRÜM', 'DÖNER & DÜRÜM', 6, true),
('PIDE / TEIGSCHIFFCHEN', 'PIDE / TEIGSCHIFFCHEN', 7, true),
('LAHMACUN / TÜRKISCHE PIZZA', 'LAHMACUN / TÜRKISCHE PIZZA', 8, true),
('PIZZA', 'PIZZA', 9, true),
('BALIK / FISCH', 'BALIK / FISCH', 10, true),
('ARA SICAKLAR / ZWISCHENSPEISEN', 'ARA SICAKLAR / ZWISCHENSPEISEN', 11, true),
('MEZELER / VORSPEISEN', 'MEZELER / VORSPEISEN', 12, true),
('SALATALAR / SALATE', 'SALATALAR / SALATE', 13, true),
('KIDS MENU', 'KIDS MENU', 14, true),
('PIZZABRÖTCHEN', 'PIZZABRÖTCHEN', 15, true),
('EXTRA BEILAGEN', 'EXTRA BEILAGEN', 16, true),
('TATLI / DESSERTS', 'TATLI / DESSERTS', 17, true),
('İÇECEKLER / KALTE GETRÄNKE', 'İÇECEKLER / KALTE GETRÄNKE', 18, true),
('SICAK İÇECEKLER / WARME GETRÄNKE', 'SICAK İÇECEKLER / WARME GETRÄNKE', 19, true);

-- 3) Insert all dishes with allergen codes
-- Using subquery to lookup category_id by name
INSERT INTO public.dishes (category_id, menu_number, name_tr, name_de, price, description_de, description_tr, raw_details, allergen_codes, is_active, position) VALUES

-- GÜNÜN ÇORBASI / TÄGLICHE SUPPEN
((SELECT id FROM public.dish_categories WHERE name_de='GÜNÜN ÇORBASI / TÄGLICHE SUPPEN'), '01', 'Mercimek Çorbası', 'Linsensuppe', 5.00, NULL, NULL, '', '{}', true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='GÜNÜN ÇORBASI / TÄGLICHE SUPPEN'), '02', 'İşkembe Çorbası', 'Pansensuppe', 6.00, NULL, NULL, '', '{}', true, 2),
((SELECT id FROM public.dish_categories WHERE name_de='GÜNÜN ÇORBASI / TÄGLICHE SUPPEN'), '03', 'Kelle Paça', 'Lammkopfsuppe, Lammzungensuppe', 6.00, NULL, NULL, '', '{}', true, 3),
((SELECT id FROM public.dish_categories WHERE name_de='GÜNÜN ÇORBASI / TÄGLICHE SUPPEN'), '04', 'Tavuk Çorbası', 'Hähnchensuppe', 6.00, NULL, NULL, '', '{}', true, 4),
((SELECT id FROM public.dish_categories WHERE name_de='GÜNÜN ÇORBASI / TÄGLICHE SUPPEN'), '05', 'Kapadokya Karışık Çorba', 'Pansensuppe und Fleischsuppe', 7.00, NULL, NULL, '', '{}', true, 5),

-- SALATALAR / SALATE
((SELECT id FROM public.dish_categories WHERE name_de='SALATALAR / SALATE'), '25', 'Çoban Salatası', 'Bauernsalat mit Scharfskäse', 7.00, NULL, NULL, '9: mit Milcheiweiß', ARRAY['9'], true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='SALATALAR / SALATE'), '26', 'Karışık Salata', 'klein gehackter gemischter Salat', 9.00, NULL, NULL, '', '{}', true, 2),
((SELECT id FROM public.dish_categories WHERE name_de='SALATALAR / SALATE'), '27', 'Ton Balığı Salatası', 'Salat mit Thunfisch', 9.00, NULL, NULL, 'f: Thunfisch (9,5%): Wasser, Senf (Senfsaat enthalten), Rapsöl, modifizierte Stärke, Milcheiweiß', ARRAY['f'], true, 3),
((SELECT id FROM public.dish_categories WHERE name_de='SALATALAR / SALATE'), '28', 'Tavuklu Salata', 'Salat mit Hähnchenbruststreifen', 13.00, NULL, NULL, '', '{}', true, 4),

-- SICAK İÇECEKLER / WARME GETRÄNKE
((SELECT id FROM public.dish_categories WHERE name_de='SICAK İÇECEKLER / WARME GETRÄNKE'), '150', 'Tee klein', 'Tee klein', 1.00, NULL, NULL, '', '{}', true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='SICAK İÇECEKLER / WARME GETRÄNKE'), '151', 'Tee groß', 'Tee groß', 2.00, NULL, NULL, '', '{}', true, 2),
((SELECT id FROM public.dish_categories WHERE name_de='SICAK İÇECEKLER / WARME GETRÄNKE'), '152', 'Kaffe', 'Kaffe', 2.50, NULL, NULL, '', '{}', true, 3),
((SELECT id FROM public.dish_categories WHERE name_de='SICAK İÇECEKLER / WARME GETRÄNKE'), '153', 'Expresso', 'Expresso', 2.50, NULL, NULL, '', '{}', true, 4),
((SELECT id FROM public.dish_categories WHERE name_de='SICAK İÇECEKLER / WARME GETRÄNKE'), '154', 'Cappuccino', 'Cappuccino', 3.00, NULL, NULL, 'g: Nitritpökelsalz: E250, Antioxidationsmittel, Dextrose, Würze, natürliche Aromen', ARRAY['g'], true, 5),
((SELECT id FROM public.dish_categories WHERE name_de='SICAK İÇECEKLER / WARME GETRÄNKE'), '155', 'Latte macchiato', 'Latte macchiato', 3.00, NULL, NULL, 'g: Nitritpökelsalz: E250, Antioxidationsmittel, Dextrose, Würze, natürliche Aromen', ARRAY['g'], true, 6),
((SELECT id FROM public.dish_categories WHERE name_de='SICAK İÇECEKLER / WARME GETRÄNKE'), '156', 'türkisch Mokka', 'türkisch Mokka', 3.00, NULL, NULL, '', '{}', true, 7),
((SELECT id FROM public.dish_categories WHERE name_de='SICAK İÇECEKLER / WARME GETRÄNKE'), '157', 'heißer Kakao', 'heißer Kakao', 3.00, NULL, NULL, '', '{}', true, 8),

-- BALIK / FISCH
((SELECT id FROM public.dish_categories WHERE name_de='BALIK / FISCH'), '80', 'Çupra', 'Dorade mit Salat und Reis / Bulgur', 17.00, NULL, NULL, 'f: Thunfisch (9,5%): Wasser, Senf (Senfsaat enthalten), Rapsöl, modifizierte Stärke, Milcheiweiß; k: Bulgur enthält Gluten', ARRAY['f','k'], true, 1),

-- PIDE / TEIGSCHIFFCHEN
((SELECT id FROM public.dish_categories WHERE name_de='PIDE / TEIGSCHIFFCHEN'), '85', 'Kaşarlı Pide', 'Teigschiffchen mit Goudakäse', 8.00, 'Extra Ei 1€', NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; g: Nitritpökelsalz: E250, Antioxidationsmittel, Dextrose, Würze, natürliche Aromen; i: Elmalta-Erzeugnisse: Stärkesirup, Fruchtmark (Aprikose, Pfirsich), Trinkwasser, Zucker, Branntweinessig, modifizierte Maisstärke, SOJASAUCE (Wasser, SOJABOHNEN, WEIZEN, Salz), Salz, Rapsöl, Ananassaftkonzentrat, Essigsäure(E260), Gewürze (Sellerie), Verdickungsmittel (E415), Karamell', ARRAY['a','g','i'], true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='PIDE / TEIGSCHIFFCHEN'), '86', 'Sucuklu Pide', 'Teigschiffchen mit Knoblauchwurst und Goudakäse', 9.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; g: Nitritpökelsalz: E250, Antioxidationsmittel, Dextrose, Würze, natürliche Aromen; i: Elmalta-Erzeugnisse...; c: Rindfleisch(Döner)-Zutaten: Kalbfleisch, Putenfleisch, Weizenmehl, Trinkwasser, Schweinelt, Speisalz, Gewürze (Sellerie), Geschmacksverstärker E621, Stabilisatore E451...', ARRAY['a','g','i','c'], true, 2),
((SELECT id FROM public.dish_categories WHERE name_de='PIDE / TEIGSCHIFFCHEN'), '87', 'Kıymalı Pide', 'Teigschiffchen mit Rinderhackfleisch', 9.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz', ARRAY['a'], true, 3),
((SELECT id FROM public.dish_categories WHERE name_de='PIDE / TEIGSCHIFFCHEN'), '88', 'Ispanaklı Pide', 'Teigschiffchen mit Spinat, Zwiebel und Goudakäse', 9.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; g: Nitritpökelsalz: E250, Antioxidationsmittel, Dextrose, Würze, natürliche Aromen', ARRAY['a','g'], true, 4),
((SELECT id FROM public.dish_categories WHERE name_de='PIDE / TEIGSCHIFFCHEN'), '89', 'Vegetarisch Pide', 'Teigschiffchen mit Gemüse', 9.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz', ARRAY['a'], true, 5),
((SELECT id FROM public.dish_categories WHERE name_de='PIDE / TEIGSCHIFFCHEN'), '90', 'Dönerli Pide', 'Teigschiffchen mit Döner und Goudakäse', 10.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; c: Rindfleisch(Döner)-Zutaten: Kalbfleisch, Putenfleisch...; g: Nitritpökelsalz: E250, Antioxidationsmittel, Dextrose, Würze, natürliche Aromen', ARRAY['a','c','g'], true, 6),
((SELECT id FROM public.dish_categories WHERE name_de='PIDE / TEIGSCHIFFCHEN'), '91', 'Kuşbaşı Pide', 'Teigschiffchen mit geschnitzeltem Fleisch', 10.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; c: Rindfleisch(Döner)-Zutaten...; g: Nitritpökelsalz: E250...; i: Elmalta-Erzeugnisse...', ARRAY['a','c','g','i'], true, 7),
((SELECT id FROM public.dish_categories WHERE name_de='PIDE / TEIGSCHIFFCHEN'), '92', 'Karışık Pide', 'gemischtes Teigschiffchen', 12.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; c: Rindfleisch(Döner)-Zutaten...; g: Nitritpökelsalz: E250...; i: Elmalta-Erzeugnisse...', ARRAY['a','c','g','i'], true, 8),

-- KIDS MENU
((SELECT id FROM public.dish_categories WHERE name_de='KIDS MENU'), '110', 'Pommes', 'Pommes', 4.00, NULL, NULL, '16: Pommes: Antioxidationsmittel: Ascorbinsäure, Würze und Aromen.modifizierte Stärke, Dextrose.', ARRAY['16'], true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='KIDS MENU'), '111', 'Nugget 6 Stück', 'mit Pommes', 7.00, NULL, NULL, '', '{}', true, 2),
((SELECT id FROM public.dish_categories WHERE name_de='KIDS MENU'), '112', 'Kinder Döner', 'Döner mit Pommes', 8.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; c: Rindfleisch(Döner)-Zutaten: Kalbfleisch, Putenfleisch...', ARRAY['a','c'], true, 3),
((SELECT id FROM public.dish_categories WHERE name_de='KIDS MENU'), '113', 'Kinder Tavuk Şiş', 'Hähnchenspieß mit Pommes', 9.00, NULL, NULL, '16: Pommes: Antioxidationsmittel: Ascorbinsäure, Würze und Aromen.modifizierte Stärke, Dextrose.', ARRAY['16'], true, 4),
((SELECT id FROM public.dish_categories WHERE name_de='KIDS MENU'), '114', 'Kinder Köfte', 'Frikadelle mit Pommes', 9.00, NULL, NULL, '16: Pommes: Antioxidationsmittel: Ascorbinsäure, Würze und Aromen.modifizierte Stärke, Dextrose.', ARRAY['16'], true, 5),
((SELECT id FROM public.dish_categories WHERE name_de='KIDS MENU'), NULL, 'Kinder-Hamburger + Pommes', 'Kinder-Hamburger + Pommes', 11.99, NULL, NULL, '', '{}', true, 6),

-- TATLI / DESSERTS
((SELECT id FROM public.dish_categories WHERE name_de='TATLI / DESSERTS'), '125', 'Künefe', 'Fadennudeln mit Käse gebacken, Sahne, Pistazien in Zuckersirup', 7.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; g: Nitritpökelsalz: E250...; i: Elmalta-Erzeugnisse...; l: Nüsse, Walnüsse, Pistazien', ARRAY['a','g','i','l'], true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='TATLI / DESSERTS'), '126', 'Baklava', 'Süsser Sauce in Zuckersirup', 6.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz', ARRAY['a'], true, 2),
((SELECT id FROM public.dish_categories WHERE name_de='TATLI / DESSERTS'), '127', 'Katmer', 'Blätterteig mit gehackten Wallnüsse, Pistazien in Zuckersirup', 7.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; l: Nüsse, Walnüsse, Pistazien', ARRAY['a','l'], true, 3),
((SELECT id FROM public.dish_categories WHERE name_de='TATLI / DESSERTS'), '128', 'Sütlaç', 'Milchreis', 5.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; l: Nüsse, Walnüsse, Pistazien', ARRAY['a','l'], true, 4),

-- İÇECEKLER / KALTE GETRÄNKE
((SELECT id FROM public.dish_categories WHERE name_de='İÇECEKLER / KALTE GETRÄNKE'), '130', 'Mineralwasser klein', '0,2 l', 2.00, NULL, NULL, '', '{}', true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='İÇECEKLER / KALTE GETRÄNKE'), '132', 'Wasser', '0,5 l', 2.00, NULL, NULL, '', '{}', true, 2),
((SELECT id FROM public.dish_categories WHERE name_de='İÇECEKLER / KALTE GETRÄNKE'), '134', 'Ayran', '0,2 l', 2.00, NULL, NULL, 'g: Nitritpökelsalz: E250, Antioxidationsmittel, Dextrose, Würze, natürliche Aromen', ARRAY['g'], true, 3),
((SELECT id FROM public.dish_categories WHERE name_de='İÇECEKLER / KALTE GETRÄNKE'), '135', 'Coca Cola', '0,2l', 2.50, NULL, NULL, '1: beinhaltet Zusatzstoffe; 3: mit Antixodationsmittel; 5: koffeeinhaltig', ARRAY['1','3','5'], true, 4),
((SELECT id FROM public.dish_categories WHERE name_de='İÇECEKLER / KALTE GETRÄNKE'), '136', 'Cola Zero', '0,2l', 2.50, NULL, NULL, '1: beinhaltet Zusatzstoffe; 3: mit Antixodationsmittel; 5: koffeeinhaltig; 6: mit Süßungsmittel; 7: enthält eine Phenylalinquelle', ARRAY['1','3','5','6','7'], true, 5),
((SELECT id FROM public.dish_categories WHERE name_de='İÇECEKLER / KALTE GETRÄNKE'), '137', 'Fanta', '0,2l', 2.50, NULL, NULL, '1: beinhaltet Zusatzstoffe; 3: mit Antixodationsmittel', ARRAY['1','3'], true, 6),
((SELECT id FROM public.dish_categories WHERE name_de='İÇECEKLER / KALTE GETRÄNKE'), '138', 'Sprite', '0,2L', 2.50, NULL, NULL, '3: mit Antixodationsmittel', ARRAY['3'], true, 7),
((SELECT id FROM public.dish_categories WHERE name_de='İÇECEKLER / KALTE GETRÄNKE'), '139', 'Bitter Lemon', '0,2 l', 2.50, NULL, NULL, '14: Chininhaltig; 15: Säurungsregulatoren', ARRAY['14','15'], true, 8),
((SELECT id FROM public.dish_categories WHERE name_de='İÇECEKLER / KALTE GETRÄNKE'), '140', 'Ginger', '0,2 l', 2.50, NULL, NULL, '1: beinhaltet Zusatzstoffe', ARRAY['1'], true, 9),
((SELECT id FROM public.dish_categories WHERE name_de='İÇECEKLER / KALTE GETRÄNKE'), '141', 'Eistee', '0,2 l (Zorten)', 2.50, NULL, NULL, '', '{}', true, 10),
((SELECT id FROM public.dish_categories WHERE name_de='İÇECEKLER / KALTE GETRÄNKE'), '142', 'Apfelsaft Schorle', '0,2l', 2.50, NULL, NULL, '2: mit Konservierungsstoff', ARRAY['2'], true, 11),
((SELECT id FROM public.dish_categories WHERE name_de='İÇECEKLER / KALTE GETRÄNKE'), '143', 'Uludag', '0,33l', 2.50, NULL, NULL, '3: mit Antixodationsmittel; 6: mit Süßungsmittel', ARRAY['3','6'], true, 12),
((SELECT id FROM public.dish_categories WHERE name_de='İÇECEKLER / KALTE GETRÄNKE'), '144', 'Mezzo Mix', '0,2 l', 2.50, NULL, NULL, '1: beinhaltet Zusatzstoffe; 3: mit Antixodationsmittel; 5: koffeeinhaltig', ARRAY['1','3','5'], true, 13),

-- MEZELER / VORSPEISEN
((SELECT id FROM public.dish_categories WHERE name_de='MEZELER / VORSPEISEN'), '10', 'Vorspeisenteller (groß)', 'warm und kalt', 14.00, NULL, NULL, '', '{}', true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='MEZELER / VORSPEISEN'), '11', 'Vorspeisenteller (klein)', 'warm und kalt', 12.00, NULL, NULL, '', '{}', true, 2),
((SELECT id FROM public.dish_categories WHERE name_de='MEZELER / VORSPEISEN'), '12', 'Haydari', 'Joghurt mit Gurken und Knoblauch', 6.00, NULL, NULL, '9: mit Milcheiweiß', ARRAY['9'], true, 3),
((SELECT id FROM public.dish_categories WHERE name_de='MEZELER / VORSPEISEN'), '13', 'Antep Ezme', 'pürierte scharfe Paprika mit Zwiebeln, Tomaten', 6.00, NULL, NULL, '', '{}', true, 4),

-- ARA SICAKLAR / ZWISCHENSPEISEN
((SELECT id FROM public.dish_categories WHERE name_de='ARA SICAKLAR / ZWISCHENSPEISEN'), '15', 'Sigara Böreği', 'Teigblättchen gefüllt mit Käse', 7.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; 9: mit Milcheiweiß', ARRAY['a','9'], true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='ARA SICAKLAR / ZWISCHENSPEISEN'), '16', 'Mantar Şiş', 'Champignons Spieße', 8.00, NULL, NULL, '', '{}', true, 2),

-- LAHMACUN / TÜRKISCHE PIZZA
((SELECT id FROM public.dish_categories WHERE name_de='LAHMACUN / TÜRKISCHE PIZZA'), '20', 'Lahmacun', 'türkische Pizza ohne alles', 3.50, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; b: Pizza / Türkische Pizza / Pide: Weizenmehl, Gluten, Hefe, Milch, Ei, Zucker und Salz', ARRAY['a','b'], true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='LAHMACUN / TÜRKISCHE PIZZA'), '21', 'Lahmacun Salatalı', 'türkische Pizza mit Salat', 5.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; b: Pizza / Türkische Pizza / Pide: Weizenmehl, Gluten, Hefe, Milch, Ei, Zucker und Salz', ARRAY['a','b'], true, 2),
((SELECT id FROM public.dish_categories WHERE name_de='LAHMACUN / TÜRKISCHE PIZZA'), '22', 'Lahmacun Dönerli', 'türkische Pizza mit Döner und Salat', 8.50, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; c: Rindfleisch(Döner)-Zutaten: Kalbfleisch, Putenfleisch...; b: Pizza / Türkische Pizza / Pide: Weizenmehl, Gluten, Hefe, Milch, Ei, Zucker und Salz', ARRAY['a','b','c'], true, 3),
((SELECT id FROM public.dish_categories WHERE name_de='LAHMACUN / TÜRKISCHE PIZZA'), '22', 'Balon Brot Extra', 'Balon Brot Extra', 2.00, NULL, NULL, '', '{}', true, 4),

-- IZGARA ÇEŞİTLERİ / GRILLSPEZIALITÄTEN
((SELECT id FROM public.dish_categories WHERE name_de='IZGARA ÇEŞİTLERİ / GRILLSPEZIALITÄTEN'), '30', 'Adana Kebab', 'scharfer Hackfleischspieß mit Salat und Reis / Bulgur', 16.00, NULL, NULL, 'k: Bulgur enthält Gluten', ARRAY['k'], true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='IZGARA ÇEŞİTLERİ / GRILLSPEZIALITÄTEN'), '31', 'Urfa Kebab', 'Hackfleischspieß mit Salat und Reis / Bulgur', 16.00, NULL, NULL, 'k: Bulgur enthält Gluten', ARRAY['k'], true, 2),
((SELECT id FROM public.dish_categories WHERE name_de='IZGARA ÇEŞİTLERİ / GRILLSPEZIALITÄTEN'), '32', 'Kuzu Şiş', 'Lammspieß mit Salat und Reis / Bulgur', 18.00, NULL, NULL, 'k: Bulgur enthält Gluten', ARRAY['k'], true, 3),
((SELECT id FROM public.dish_categories WHERE name_de='IZGARA ÇEŞİTLERİ / GRILLSPEZIALITÄTEN'), '33', 'Tavuk Şiş', 'Hähnchenspieß mit Salat und Reis / Bulgur', 14.00, NULL, NULL, 'k: Bulgur enthält Gluten', ARRAY['k'], true, 4),
((SELECT id FROM public.dish_categories WHERE name_de='IZGARA ÇEŞİTLERİ / GRILLSPEZIALITÄTEN'), '34', 'Köfte Teller', 'Frikadelle mit Salat und Reis / Bulgur', 14.00, NULL, NULL, 'k: Bulgur enthält Gluten', ARRAY['k'], true, 5),
((SELECT id FROM public.dish_categories WHERE name_de='IZGARA ÇEŞİTLERİ / GRILLSPEZIALITÄTEN'), '35', 'Tavuk Kanat', 'Hähnchenflügel mit Salat und Reis / Bulgur', 14.00, NULL, NULL, 'k: Bulgur enthält Gluten', ARRAY['k'], true, 6),
((SELECT id FROM public.dish_categories WHERE name_de='IZGARA ÇEŞİTLERİ / GRILLSPEZIALITÄTEN'), '36', 'Kuzu Pirzola', 'Lammkotelett mit Salat und Reis / Bulgur', 20.00, NULL, NULL, 'k: Bulgur enthält Gluten', ARRAY['k'], true, 7),
((SELECT id FROM public.dish_categories WHERE name_de='IZGARA ÇEŞİTLERİ / GRILLSPEZIALITÄTEN'), '37', 'Kuzu Kaburga', 'Lammrippen mit Salat und Reis / Bulgur', 19.00, NULL, NULL, 'k: Bulgur enthält Gluten', ARRAY['k'], true, 8),
((SELECT id FROM public.dish_categories WHERE name_de='IZGARA ÇEŞİTLERİ / GRILLSPEZIALITÄTEN'), '38', 'Karışık Izgara', 'Gemischte Grill Teller mit Salat und Reis / Bulgur', 22.00, NULL, NULL, 'k: Bulgur enthält Gluten', ARRAY['k'], true, 9),
((SELECT id FROM public.dish_categories WHERE name_de='IZGARA ÇEŞİTLERİ / GRILLSPEZIALITÄTEN'), '45', 'Karışık Izgara 2 Kişilik', 'Grillplatte für 2 Personen', 41.00, NULL, NULL, 'k: Bulgur enthält Gluten; c: Rindfleisch(Döner)-Zutaten: Kalbfleisch, Putenfleisch...', ARRAY['k','c'], true, 10),
((SELECT id FROM public.dish_categories WHERE name_de='IZGARA ÇEŞİTLERİ / GRILLSPEZIALITÄTEN'), '46', 'Karışık Izgara 3 Kişilik', 'Grillplatte für 3 Personen', 60.00, NULL, NULL, 'k: Bulgur enthält Gluten; c: Rindfleisch(Döner)-Zutaten: Kalbfleisch, Putenfleisch...', ARRAY['k','c'], true, 11),
((SELECT id FROM public.dish_categories WHERE name_de='IZGARA ÇEŞİTLERİ / GRILLSPEZIALITÄTEN'), '47', 'Karışık Izgara 4 Kişilik', 'Grillplatte für 4 Personen', 80.00, NULL, NULL, 'k: Bulgur enthält Gluten; c: Rindfleisch(Döner)-Zutaten: Kalbfleisch, Putenfleisch...', ARRAY['k','c'], true, 12),
((SELECT id FROM public.dish_categories WHERE name_de='IZGARA ÇEŞİTLERİ / GRILLSPEZIALITÄTEN'), '48', 'Kapadokya platte', 'Grillplatte für 5 Personen', 99.00, NULL, NULL, 'k: Bulgur enthält Gluten; c: Rindfleisch(Döner)-Zutaten: Kalbfleisch, Putenfleisch...', ARRAY['k','c'], true, 13),

-- YOĞURTLULAR / MIT JOGHURT
((SELECT id FROM public.dish_categories WHERE name_de='YOĞURTLULAR / MIT JOGHURT'), '50', 'Adana Kebab Yoğurtlu', 'mit Joghurt, auf geröstetem Fladenbrot scharfer Hackfleischspieß', 18.00, NULL, NULL, 'g: Nitritpökelsalz: E250...; a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; k: Bulgur enthält Gluten', ARRAY['g','a','k'], true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='YOĞURTLULAR / MIT JOGHURT'), '51', 'Beyti Sarma', 'Hackfleischspieß im Blätterteig mit Joghurt, Tomatensoße, Butter', 18.00, NULL, NULL, 'g: Nitritpökelsalz: E250...; a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; k: Bulgur enthält Gluten', ARRAY['g','a','k'], true, 2),
((SELECT id FROM public.dish_categories WHERE name_de='YOĞURTLULAR / MIT JOGHURT'), '52', 'Ali Nazik', 'Lammspieß mit pikanten Gewürzen, Joghurtsoße', 20.00, NULL, NULL, 'g: Nitritpökelsalz: E250...; a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; k: Bulgur enthält Gluten', ARRAY['g','a','k'], true, 3),
((SELECT id FROM public.dish_categories WHERE name_de='YOĞURTLULAR / MIT JOGHURT'), '53', 'Döner Beyti', 'Döner im Blätterteig mit Joghurt, Tomatensoße, Butter', 16.00, NULL, NULL, 'g: Nitritpökelsalz: E250...; a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; k: Bulgur enthält Gluten', ARRAY['g','a','k'], true, 4),

-- DUBLE ŞİŞLER / DOUBLE SPIEẞ
((SELECT id FROM public.dish_categories WHERE name_de='DUBLE ŞİŞLER / DOUBLE SPIEẞ'), '55', 'Adana Kebab (doppeltes Adana)', 'scharfer Hackfleischspieß mit Salat und Reis / Bulgur', 25.00, NULL, NULL, 'k: Bulgur enthält Gluten', ARRAY['k'], true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='DUBLE ŞİŞLER / DOUBLE SPIEẞ'), '56', 'Kuzu Şiş Adana', 'Lammspieß und Adana scharfer Rinderhackfleischspieß mit Salat und Reis / Bulgur', 28.00, NULL, NULL, 'k: Bulgur enthält Gluten', ARRAY['k'], true, 2),
((SELECT id FROM public.dish_categories WHERE name_de='DUBLE ŞİŞLER / DOUBLE SPIEẞ'), '57', 'Adana Tavuk Şiş', 'Hähnchenspieß und Adana scharfer Rinderhackfleischspieß mit Salat und Reis / Bulgur', 25.00, NULL, NULL, 'k: Bulgur enthält Gluten', ARRAY['k'], true, 3),

-- SAÇ TAVALAR / PFANNENGERICHTE
((SELECT id FROM public.dish_categories WHERE name_de='SAÇ TAVALAR / PFANNENGERICHTE'), '60', 'Kuzu Saç Tava', 'Lammfleischstückchen mit Paprika und Reis / Bulgur', 17.00, NULL, NULL, 'k: Bulgur enthält Gluten', ARRAY['k'], true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='SAÇ TAVALAR / PFANNENGERICHTE'), '61', 'Tavuk Saç Tava', 'geschnitzeltes Hähnchenfleisch mit Tomaten, Paprikaş und Reis / Bulgur', 15.00, NULL, NULL, 'k: Bulgur enthält Gluten', ARRAY['k'], true, 2),
((SELECT id FROM public.dish_categories WHERE name_de='SAÇ TAVALAR / PFANNENGERICHTE'), '62', 'Sebze Saç Tava', 'Gemüsepfanne mit Reis / Bulgur', 13.00, NULL, NULL, 'k: Bulgur enthält Gluten', ARRAY['k'], true, 3),

-- DÖNER & DÜRÜM (kısa versiyon, tümünü ekleyeceğim)
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '65', 'Dörnertasche', 'Hähnchendöner mit Salat und Soauce', 6.00, NULL, NULL, 'k: Bulgur enthält Gluten; c: Rindfleisch(Döner)-Zutaten...; 16: Pommes: Antioxidationsmittel: Ascorbinsäure, Würze und Aromen.modifizierte Stärke, Dextrose.', ARRAY['k','c','16'], true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '66', 'Dönerteller klein', 'Hähnchendöner mit Salat und Soauce', 10.00, NULL, NULL, 'k: Bulgur enthält Gluten; c: Rindfleisch(Döner)-Zutaten...; 16: Pommes: Antioxidationsmittel: Ascorbinsäure, Würze und Aromen.modifizierte Stärke, Dextrose.', ARRAY['k','c','16'], true, 2),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '67', 'Dönerteller groß', 'Hähnchendöner mit Salat und Soauce', 12.00, NULL, NULL, 'k: Bulgur enthält Gluten; c: Rindfleisch(Döner)-Zutaten...; 16: Pommes: Antioxidationsmittel: Ascorbinsäure, Würze und Aromen.modifizierte Stärke, Dextrose.', ARRAY['k','c','16'], true, 3),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '68', 'Döner Dürüm', 'Hähnchendöner mit Salat und Soauce', 7.00, NULL, NULL, 'k: Bulgur enthält Gluten; c: Rindfleisch(Döner)-Zutaten...; 16: Pommes: Antioxidationsmittel: Ascorbinsäure, Würze und Aromen.modifizierte Stärke, Dextrose.', ARRAY['k','c','16'], true, 4),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '69', 'Dönertasche', 'Kalb Döner mit Salat und Soauce', 7.00, NULL, NULL, 'k: Bulgur enthält Gluten; c: Rindfleisch(Döner)-Zutaten...; 16: Pommes: Antioxidationsmittel: Ascorbinsäure, Würze und Aromen.modifizierte Stärke, Dextrose.', ARRAY['k','c','16'], true, 5),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '70', 'Dönerteller klein', 'Kalb Döner mit Salat und Reis / Bulgur / Pommes', 11.00, NULL, NULL, 'k: Bulgur enthält Gluten; c: Rindfleisch(Döner)-Zutaten...; 16: Pommes: Antioxidationsmittel: Ascorbinsäure, Würze und Aromen.modifizierte Stärke, Dextrose.', ARRAY['k','c','16'], true, 6),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '71', 'Dönerteller groß', 'Kalb Döner mit Salat und Reis / Bulgur / Pommes', 13.00, NULL, NULL, 'k: Bulgur enthält Gluten; c: Rindfleisch(Döner)-Zutaten...; 16: Pommes: Antioxidationsmittel: Ascorbinsäure, Würze und Aromen.modifizierte Stärke, Dextrose.', ARRAY['k','c','16'], true, 7),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '72', 'İskender', 'fein geschnitzeltes Döner auf geröstetem Fladenbrot mit Joghurt und Tomatensauce', 16.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; g: Nitritpökelsalz: E250...; c: Rindfleisch(Döner)-Zutaten...', ARRAY['a','g','c'], true, 8),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '73', 'Döner Dürüm', 'Kalb Döner eingerollt in einer Teigrolle mit Salat und Soße', 8.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; c: Rindfleisch(Döner)-Zutaten...; 9: mit Milcheiweiß', ARRAY['a','c','9'], true, 9),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '74', 'Döner Dürüm groß', 'Kalb Döner eingerollt in einer Teigrolle mit Salat und Soße', 10.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; g: Nitritpökelsalz: E250...', ARRAY['a','g'], true, 10),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '75', 'Döner Box', 'Kalb Döner mit Pommes', 7.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; c: Rindfleisch(Döner)-Zutaten...', ARRAY['a','c'], true, 11),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '76', 'Adana Dürüm', 'Hackfleischspieß eingerollt in einer Teigrolle mit Salat und Soße', 8.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; 9: mit Milcheiweiß', ARRAY['a','9'], true, 12),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '77', 'Adana Dürüm groß', 'Hackfleischspieß eingerollt in einer Teigrolle mit Salat und Soße', 10.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; 9: mit Milcheiweiß', ARRAY['a','9'], true, 13),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '78', 'Kuzu Şiş Dürüm', 'Lammspieß eingerollt in einer Teigrolle mit Salat und Soße', 10.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; 9: mit Milcheiweiß', ARRAY['a','9'], true, 14),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '79', 'Kuzu Şiş Dürüm groß', 'Lammspieß eingerollt in einer Teigrolle mit Salat und Soße', 12.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; 9: mit Milcheiweiß', ARRAY['a','9'], true, 15),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '80', 'Tavuk Şiş Dürüm', 'Hähnchenspieß eingerollt in einer Teigrolle mit Salat und Soße', 8.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; 9: mit Milcheiweiß', ARRAY['a','9'], true, 16),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '81', 'Tavuk Şiş Dürüm groß', 'Hähnchenspieß eingerollt in einer Teigrolle mit Salat und Soße', 10.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; 9: mit Milcheiweiß', ARRAY['a','9'], true, 17),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '82', 'Falafel Dürüm', 'Falafel eingerollt in einer Teigrolle mit Salat und Soße', 9.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; 9: mit Milcheiweiß; k: Bulgur enthält Gluten', ARRAY['a','9','k'], true, 18),
((SELECT id FROM public.dish_categories WHERE name_de='DÖNER & DÜRÜM'), '83', 'Falafel Teller', 'mit Reis / Bulgur, Pommes, Salat und Soße', 12.00, NULL, NULL, '', '{}', true, 19),

-- PIZZA
((SELECT id FROM public.dish_categories WHERE name_de='PIZZA'), '95', 'Margherita', 'Tomatensauce, Käse', 7.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; g: Nitritpökelsalz: E250...', ARRAY['a','g'], true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='PIZZA'), '96', 'Pizza Tonno', 'Tomatensauce, Käse, Zwiebel und Thunfisch', 9.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; g: Nitritpökelsalz: E250...; f: Thunfisch (9,5%): Wasser, Senf (Senfsaat enthalten)...', ARRAY['a','g','f'], true, 2),
((SELECT id FROM public.dish_categories WHERE name_de='PIZZA'), '97', 'Pizza Döner', 'Tomatensauce, Käse, Zwiebel und Döner', 10.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; g: Nitritpökelsalz: E250...; c: Rindfleisch(Döner)-Zutaten...', ARRAY['a','g','c'], true, 3),
((SELECT id FROM public.dish_categories WHERE name_de='PIZZA'), '98', 'Pizza Sucuk', 'Tomatensauce, Käse und Knoblauchwurst', 10.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; g: Nitritpökelsalz: E250...; c: Rindfleisch(Döner)-Zutaten...', ARRAY['a','g','c'], true, 4),
((SELECT id FROM public.dish_categories WHERE name_de='PIZZA'), '99', 'Pizza Vegetarisch', 'Gemüse', 10.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz', ARRAY['a'], true, 5),
((SELECT id FROM public.dish_categories WHERE name_de='PIZZA'), '100', 'Pizza Kapadokya', 'Hähnchenwurst, Pilze, Brokkoli und Mais', 10.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; c: Rindfleisch(Döner)-Zutaten...', ARRAY['a','c'], true, 6),
((SELECT id FROM public.dish_categories WHERE name_de='PIZZA'), '101', 'Pizza Funghi', 'Tomatensauce, Käse und Champignons', 9.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; g: Nitritpökelsalz: E250...', ARRAY['a','g'], true, 7),

-- PIZZABRÖTCHEN
((SELECT id FROM public.dish_categories WHERE name_de='PIZZABRÖTCHEN'), '105', 'Gefüllte Pizzabrötchen mit Käse', 'Gefüllte Pizzabrötchen mit Käse', 6.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; g: Nitritpökelsalz: E250...', ARRAY['a','g'], true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='PIZZABRÖTCHEN'), '106', 'Gefüllte Pizzabrötchen mit Thunfisch', 'Gefüllte Pizzabrötchen mit Thunfisch', 8.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; g: Nitritpökelsalz: E250...; f: Thunfisch (9,5%): Wasser, Senf (Senfsaat enthalten)...', ARRAY['a','g','f'], true, 2),
((SELECT id FROM public.dish_categories WHERE name_de='PIZZABRÖTCHEN'), '107', 'Gefüllte Pizzabrötchen mit Hähnchenbrust', 'Gefüllte Pizzabrötchen mit Hähnchenbrust', 8.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; g: Nitritpökelsalz: E250...', ARRAY['a','g'], true, 3),
((SELECT id FROM public.dish_categories WHERE name_de='PIZZABRÖTCHEN'), '108', 'Gefüllte Pizzabrötchen mit türkischer Knoblauchwurst', 'Gefüllte Pizzabrötchen mit türkischer Knoblauchwurst', 8.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; g: Nitritpökelsalz: E250...; c: Rindfleisch(Döner)-Zutaten...', ARRAY['a','g','c'], true, 4),
((SELECT id FROM public.dish_categories WHERE name_de='PIZZABRÖTCHEN'), '109', 'Gefüllte Pizzabrötchen mit Döner', 'Gefüllte Pizzabrötchen mit Döner', 8.00, NULL, NULL, 'a: Fladenbrot& Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz; g: Nitritpökelsalz: E250...; c: Rindfleisch(Döner)-Zutaten...', ARRAY['a','g','c'], true, 5),

-- EXTRA BEILAGEN
((SELECT id FROM public.dish_categories WHERE name_de='EXTRA BEILAGEN'), '115', 'Reis Portion', 'Reis Portion', 4.00, NULL, NULL, '', '{}', true, 1),
((SELECT id FROM public.dish_categories WHERE name_de='EXTRA BEILAGEN'), '116', 'Bulgur Portion', 'Bulgur Portion', 4.00, NULL, NULL, 'k: Bulgur enthält Gluten', ARRAY['k'], true, 2),
((SELECT id FROM public.dish_categories WHERE name_de='EXTRA BEILAGEN'), '117', 'Pommes', 'Pommes', 4.00, NULL, NULL, '16: Pommes: Antioxidationsmittel: Ascorbinsäure, Würze und Aromen.modifizierte Stärke, Dextrose.', ARRAY['16'], true, 3),
((SELECT id FROM public.dish_categories WHERE name_de='EXTRA BEILAGEN'), '118', 'Extra Pirzola', 'Lammkotelett stück', 4.00, NULL, NULL, '', '{}', true, 4),
((SELECT id FROM public.dish_categories WHERE name_de='EXTRA BEILAGEN'), '119', 'Extra Köfte', 'Frikadellen stück', 3.00, NULL, NULL, '', '{}', true, 5),
((SELECT id FROM public.dish_categories WHERE name_de='EXTRA BEILAGEN'), '120', 'Ketchup', 'Ketchup', 1.00, NULL, NULL, '19: Ketchup: 81% Tomatenmark, Zucker, Branntweinessig*, modifizierte Stärke, Speisesalz, Verdickungsmittel Guarkernmehl, Gewürze, Säuerungsmittel: Citronensäure.', ARRAY['19'], true, 6),
((SELECT id FROM public.dish_categories WHERE name_de='EXTRA BEILAGEN'), '121', 'Mayonnaise', 'Mayonnaise', 1.00, NULL, NULL, '17: Mayonnaise: (enthält Senfsaat), Milcheiweiß, Dextrose.', ARRAY['17'], true, 7);

COMMIT;
