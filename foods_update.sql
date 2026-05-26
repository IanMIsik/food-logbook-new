-- MacroLog: Foods table update script
-- Generated from prod_backup.sql — foods only, logs untouched
-- Uses INSERT ... ON CONFLICT to safely upsert without deleting logs

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: foods; Type: TABLE DATA; Schema: public
-- Safe upsert: inserts new rows, updates existing ones by id
--

INSERT INTO public.foods VALUES (1, 'Chicken Breast', 165, 31) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (2, 'White Rice (Cooked)', 130, 2.7) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (3, 'Apple', 52, 0.3) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (4, 'Egg (Large)', 155, 13) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (6, 'Banana', 89, 1.1) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (7, 'No fat millk', 34, 3.1) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (8, 'Egg Whites', 52, 11) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (9, 'Sweet Potatoes', 86, 1.6) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (10, 'Red beans', 130, 9) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (11, 'Bread', 255, 8) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (12, 'Coke', 42, 0) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (13, 'Mashed Potatoes', 110, 2.5) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (14, 'Cooked lean beef', 200, 25) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (15, 'Chai', 20, 0.5) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (16, 'Mandazi', 250, 7) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (17, 'Chapati', 220, 8) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (18, 'Mio Goodie White compound delight', 569.77, 7.65) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (19, 'Chicken leg', 172, 26) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (20, 'Milk (3.25%)', 63, 3.4) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (21, 'Sausage', 296, 11) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (22, 'Lentils (Kamande)', 116, 9) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (23, 'Avocado', 160, 2) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (24, 'Ugali', 123, 3) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (25, 'Cocoa Drinking chocolate', 345, 23) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (26, 'Prestige Margarine', 735, 0) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (27, 'Cooked Red Beans', 127, 9) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (28, 'Cooked Green grams (mung beans, ndengu)', 105, 8) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (29, 'Samosa (Ndengu😅)', 220, 4) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (30, 'Home Fried Potatoes (Well dried)', 220, 3) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (31, 'Cooked Cabbage', 30, 2) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (32, 'Beef meatballs ', 230, 18) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (33, 'Dairyland icecream', 230, 6) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (34, 'Queen Cake', 350, 5) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (35, 'Chevda', 400, 15) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (36, 'Indomie', 459, 11) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (37, 'Burger (Bacon + beef patty)', 400, 30) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (38, 'Sugar', 387, 0) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (39, 'Milkstar Biscuits', 210, 3.18) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (40, 'Pineapples', 50, 0.5) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (41, 'Pawpaw', 80, 1.2) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (42, 'Farmers Choice Smokies', 220, 11) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (43, 'Tiffany''s toffee', 425, 5) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (44, 'Watermelon', 30, 0.6) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (45, 'Kenchic Smokies', 172, 11) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (47, 'First Choice High Protein Strawberry Flavor', 60, 8.4) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (48, 'Low Fat Milk', 45, 3.1) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (49, 'Mango', 60, 0.8) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (50, 'Chicken burger patty', 200, 18) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (51, 'Coke Zero', 0.3, 0) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (52, 'Java Cafe latte', 108, 9) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (53, 'Cooked Mince Meat (Qmp)', 204, 25) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (54, 'Manji Chox', 517.76, 7.58) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (55, 'Java house masala tea', 100, 3) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (56, 'Matoke', 100, 1.5) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (57, 'Farmer''s Choice Beef Mince', 146, 21) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (58, 'Kenmeat meatballs', 128, 18) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (59, 'Peanuts', 567, 24.3) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;
INSERT INTO public.foods VALUES (61, 'Oreo Biscuit covered with chocolate', 504.3, 6.3) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, calories_per_100g = EXCLUDED.calories_per_100g, protein_per_100g = EXCLUDED.protein_per_100g;

--
-- Name: foods_id_seq; Type: SEQUENCE SET; Schema: public
--

SELECT pg_catalog.setval('public.foods_id_seq', 61, true);
