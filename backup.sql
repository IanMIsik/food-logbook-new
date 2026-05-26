--
-- PostgreSQL database dump
--

\restrict GQ0BXWajYj7ye8xdsKSMYeIIG9jyxDKCwg7o0xdAtkEIgz9iZ0YCDgsfjUuelkq

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: foods; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.foods (
    id integer NOT NULL,
    name text NOT NULL,
    calories_per_100g real NOT NULL,
    protein_per_100g real NOT NULL
);


ALTER TABLE public.foods OWNER TO postgres;

--
-- Name: foods_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.foods_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.foods_id_seq OWNER TO postgres;

--
-- Name: foods_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.foods_id_seq OWNED BY public.foods.id;


--
-- Name: logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.logs (
    id integer NOT NULL,
    food_id integer NOT NULL,
    grams real NOT NULL,
    date text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.logs OWNER TO postgres;

--
-- Name: logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.logs_id_seq OWNER TO postgres;

--
-- Name: logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.logs_id_seq OWNED BY public.logs.id;


--
-- Name: foods id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.foods ALTER COLUMN id SET DEFAULT nextval('public.foods_id_seq'::regclass);


--
-- Name: logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs ALTER COLUMN id SET DEFAULT nextval('public.logs_id_seq'::regclass);


--
-- Data for Name: foods; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.foods (id, name, calories_per_100g, protein_per_100g) FROM stdin;
1	Chicken Breast	165	31
2	White Rice (Cooked)	130	2.7
3	Apple	52	0.3
4	Egg (Large)	155	13
5	Oats (Rolled)	389	16.9
6	Banana	89	1.1
\.


--
-- Data for Name: logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.logs (id, food_id, grams, date, created_at) FROM stdin;
1	1	200	2025-12-28	2025-12-28 20:21:18.423355
2	2	150	2025-12-28	2025-12-28 20:21:18.428231
3	6	120	2025-12-28	2025-12-28 20:21:18.432267
4	4	100	2025-12-27	2025-12-28 20:21:18.435689
5	3	150	2025-12-27	2025-12-28 20:21:18.440749
6	5	50	2025-12-27	2025-12-28 20:21:18.445428
7	1	300	2025-12-28	2025-12-28 20:22:48.567734
8	1	200	2025-12-30	2025-12-30 09:38:23.126957
\.


--
-- Name: foods_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.foods_id_seq', 7, true);


--
-- Name: logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.logs_id_seq', 8, true);


--
-- Name: foods foods_name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.foods
    ADD CONSTRAINT foods_name_unique UNIQUE (name);


--
-- Name: foods foods_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.foods
    ADD CONSTRAINT foods_pkey PRIMARY KEY (id);


--
-- Name: logs logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs
    ADD CONSTRAINT logs_pkey PRIMARY KEY (id);


--
-- Name: logs logs_food_id_foods_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs
    ADD CONSTRAINT logs_food_id_foods_id_fk FOREIGN KEY (food_id) REFERENCES public.foods(id);


--
-- PostgreSQL database dump complete
--

\unrestrict GQ0BXWajYj7ye8xdsKSMYeIIG9jyxDKCwg7o0xdAtkEIgz9iZ0YCDgsfjUuelkq

