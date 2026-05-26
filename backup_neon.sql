--
-- PostgreSQL database dump
--


-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: foods; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO foods VALUES (1, 'Chicken Breast', 165, 31);
INSERT INTO foods VALUES (2, 'White Rice (Cooked)', 130, 2.7);
INSERT INTO foods VALUES (3, 'Apple', 52, 0.3);
INSERT INTO foods VALUES (4, 'Egg (Large)', 155, 13);
INSERT INTO foods VALUES (5, 'Oats (Rolled)', 389, 16.9);
INSERT INTO foods VALUES (6, 'Banana', 89, 1.1);


--
-- Data for Name: logs; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO logs VALUES (1, 1, 200, '2025-12-28', '2025-12-28 20:21:18.423355');
INSERT INTO logs VALUES (2, 2, 150, '2025-12-28', '2025-12-28 20:21:18.428231');
INSERT INTO logs VALUES (3, 6, 120, '2025-12-28', '2025-12-28 20:21:18.432267');
INSERT INTO logs VALUES (4, 4, 100, '2025-12-27', '2025-12-28 20:21:18.435689');
INSERT INTO logs VALUES (5, 3, 150, '2025-12-27', '2025-12-28 20:21:18.440749');
INSERT INTO logs VALUES (6, 5, 50, '2025-12-27', '2025-12-28 20:21:18.445428');
INSERT INTO logs VALUES (7, 1, 300, '2025-12-28', '2025-12-28 20:22:48.567734');
INSERT INTO logs VALUES (8, 1, 200, '2025-12-30', '2025-12-30 09:38:23.126957');


--
-- Name: foods_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('foods_id_seq', 7, true);


--
-- Name: logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('logs_id_seq', 8, true);


--
-- PostgreSQL database dump complete
--


