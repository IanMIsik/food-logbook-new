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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: foods; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE foods (
    id integer NOT NULL,
    name text NOT NULL,
    calories_per_100g real NOT NULL,
    protein_per_100g real NOT NULL
);


--
-- Name: foods_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE foods_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: foods_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE foods_id_seq OWNED BY foods.id;


--
-- Name: logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE logs (
    id integer NOT NULL,
    food_id integer NOT NULL,
    grams real NOT NULL,
    date text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE logs_id_seq OWNED BY logs.id;


--
-- Name: foods id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY foods ALTER COLUMN id SET DEFAULT nextval('foods_id_seq'::regclass);


--
-- Name: logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY logs ALTER COLUMN id SET DEFAULT nextval('logs_id_seq'::regclass);


--
-- Data for Name: foods; Type: TABLE DATA; Schema: public; Owner: -
--

COPY foods (id, name, calories_per_100g, protein_per_100g) FROM stdin;
1	Chicken Breast	165	31
2	White Rice (Cooked)	130	2.7
3	Apple	52	0.3
4	Egg (Large)	155	13
5	Oats (Rolled)	389	16.9
6	Banana	89	1.1


--
-- Data for Name: logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY logs (id, food_id, grams, date, created_at) FROM stdin;
1	1	200	2025-12-28	2025-12-28 20:21:18.423355
2	2	150	2025-12-28	2025-12-28 20:21:18.428231
3	6	120	2025-12-28	2025-12-28 20:21:18.432267
4	4	100	2025-12-27	2025-12-28 20:21:18.435689
5	3	150	2025-12-27	2025-12-28 20:21:18.440749
6	5	50	2025-12-27	2025-12-28 20:21:18.445428
7	1	300	2025-12-28	2025-12-28 20:22:48.567734
8	1	200	2025-12-30	2025-12-30 09:38:23.126957


--
-- Name: foods_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('foods_id_seq', 7, true);


--
-- Name: logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('logs_id_seq', 8, true);


--
-- Name: foods foods_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY foods
    ADD CONSTRAINT foods_name_unique UNIQUE (name);


--
-- Name: foods foods_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY foods
    ADD CONSTRAINT foods_pkey PRIMARY KEY (id);


--
-- Name: logs logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY logs
    ADD CONSTRAINT logs_pkey PRIMARY KEY (id);


--
-- Name: logs logs_food_id_foods_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY logs
    ADD CONSTRAINT logs_food_id_foods_id_fk FOREIGN KEY (food_id) REFERENCES foods(id);


--
-- PostgreSQL database dump complete
--


