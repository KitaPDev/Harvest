--
-- PostgreSQL database dump
--

-- Dumped from database version 11.5 (Debian 11.5-3.pgdg90+1)
-- Dumped by pg_dump version 12.2

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

--
-- Name: batch; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.batch (
    batch_id integer NOT NULL,
    batch_label character varying(256) NOT NULL,
    plant_id integer DEFAULT 0 NOT NULL,
    timestamp_begin timestamp without time zone NOT NULL,
    timestamp_end timestamp without time zone NOT NULL,
    weight double precision NOT NULL,
    lights_on_hour double precision NOT NULL,
    lights_off_hour double precision NOT NULL,
    misting_on_second double precision NOT NULL,
    misting_off_second double precision NOT NULL,
    remarks character varying(1024)
);


ALTER TABLE public.batch OWNER TO admin;

--
-- Name: batch_batch_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.batch_batch_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.batch_batch_id_seq OWNER TO admin;

--
-- Name: batch_batch_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.batch_batch_id_seq OWNED BY public.batch.batch_id;


--
-- Name: batches_modules; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.batches_modules (
    batch_id integer,
    module_id integer
);


ALTER TABLE public.batches_modules OWNER TO admin;

--
-- Name: batches_nutrients; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.batches_nutrients (
    batch_id integer,
    nutrient_id integer
);


ALTER TABLE public.batches_nutrients OWNER TO admin;

--
-- Name: batches_reservoirs; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.batches_reservoirs (
    batch_id integer,
    reservoir_id integer
);


ALTER TABLE public.batches_reservoirs OWNER TO admin;

--
-- Name: batches_rooms; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.batches_rooms (
    batch_id integer,
    room_id integer
);


ALTER TABLE public.batches_rooms OWNER TO admin;

--
-- Name: log_sensor_module; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.log_sensor_module (
    logged_at timestamp without time zone DEFAULT now() NOT NULL,
    module_id integer NOT NULL,
    level integer NOT NULL,
    temperature_root double precision NOT NULL,
    humidity_root double precision NOT NULL,
    CONSTRAINT log_sensor_module_level_level_check CHECK ((level > 0))
);


ALTER TABLE public.log_sensor_module OWNER TO admin;

--
-- Name: log_sensor_reservoir; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.log_sensor_reservoir (
    logged_at timestamp without time zone DEFAULT now() NOT NULL,
    reservoir_id integer NOT NULL,
    tds double precision NOT NULL,
    temperature_solution double precision NOT NULL,
    soln_level double precision NOT NULL,
    ph double precision NOT NULL
);


ALTER TABLE public.log_sensor_reservoir OWNER TO admin;

--
-- Name: log_sensor_room; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.log_sensor_room (
    logged_at timestamp without time zone DEFAULT now() NOT NULL,
    room_id integer NOT NULL,
    temperature double precision NOT NULL,
    humidity double precision NOT NULL
);


ALTER TABLE public.log_sensor_room OWNER TO admin;

--
-- Name: module; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.module (
    module_id integer NOT NULL,
    reservoir_id integer DEFAULT 0 NOT NULL,
    room_id integer DEFAULT 0 NOT NULL,
    module_label character varying(256) NOT NULL,
    level integer DEFAULT 0
);


ALTER TABLE public.module OWNER TO admin;

--
-- Name: module_module_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.module_module_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.module_module_id_seq OWNER TO admin;

--
-- Name: module_module_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.module_module_id_seq OWNED BY public.module.module_id;


--
-- Name: module_url; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.module_url (
    "moduleID" integer DEFAULT 0 NOT NULL,
    url character varying(256) DEFAULT NULL::character varying
);


ALTER TABLE public.module_url OWNER TO admin;

--
-- Name: nutrient; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.nutrient (
    nutrient_id integer NOT NULL,
    nutrient_label character varying(256) NOT NULL,
    part integer NOT NULL,
    nutrient_type integer NOT NULL,
    cc_per_liter double precision NOT NULL,
    n double precision NOT NULL,
    p double precision NOT NULL,
    k double precision NOT NULL,
    CONSTRAINT nutrient_nutrient_type_check CHECK (((nutrient_type >= 1) AND (nutrient_type <= 2))),
    CONSTRAINT nutrient_part_check CHECK (((part >= 1) AND (part <= 3)))
);


ALTER TABLE public.nutrient OWNER TO admin;

--
-- Name: nutrient_nutrient_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.nutrient_nutrient_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.nutrient_nutrient_id_seq OWNER TO admin;

--
-- Name: nutrient_nutrient_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.nutrient_nutrient_id_seq OWNED BY public.nutrient.nutrient_id;


--
-- Name: plant; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.plant (
    plant_id integer NOT NULL,
    plant_label character varying(256) NOT NULL,
    tds_low double precision NOT NULL,
    tds_high double precision NOT NULL,
    ph_low double precision NOT NULL,
    ph_high double precision NOT NULL,
    temperature_low double precision NOT NULL,
    temperature_high double precision NOT NULL,
    lights_off_hour double precision NOT NULL,
    lights_on_hour double precision NOT NULL,
    misting_on_second double precision DEFAULT 0 NOT NULL,
    misting_off_second double precision DEFAULT 0 NOT NULL
);


ALTER TABLE public.plant OWNER TO admin;

--
-- Name: plant_plant_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.plant_plant_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.plant_plant_id_seq OWNER TO admin;

--
-- Name: plant_plant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.plant_plant_id_seq OWNED BY public.plant.plant_id;


--
-- Name: reservoir; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.reservoir (
    reservoir_id integer NOT NULL,
    reservoir_label character varying(256) NOT NULL
);


ALTER TABLE public.reservoir OWNER TO admin;

--
-- Name: reservoir_reservoir_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.reservoir_reservoir_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reservoir_reservoir_id_seq OWNER TO admin;

--
-- Name: reservoir_reservoir_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.reservoir_reservoir_id_seq OWNED BY public.reservoir.reservoir_id;


--
-- Name: reservoirs_nutrients; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.reservoirs_nutrients (
    reservoir_id integer NOT NULL,
    nutrient_id integer NOT NULL
);


ALTER TABLE public.reservoirs_nutrients OWNER TO admin;

--
-- Name: room; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.room (
    room_id integer NOT NULL,
    room_label character varying(256) NOT NULL
);


ALTER TABLE public.room OWNER TO admin;

--
-- Name: room_room_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.room_room_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.room_room_id_seq OWNER TO admin;

--
-- Name: room_room_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.room_room_id_seq OWNED BY public.room.room_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(256) NOT NULL,
    hash character varying(256) NOT NULL,
    salt character varying(256) NOT NULL,
    is_admin boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO admin;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_user_id_seq OWNER TO admin;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: batch batch_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.batch ALTER COLUMN batch_id SET DEFAULT nextval('public.batch_batch_id_seq'::regclass);


--
-- Name: module module_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.module ALTER COLUMN module_id SET DEFAULT nextval('public.module_module_id_seq'::regclass);


--
-- Name: nutrient nutrient_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.nutrient ALTER COLUMN nutrient_id SET DEFAULT nextval('public.nutrient_nutrient_id_seq'::regclass);


--
-- Name: plant plant_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.plant ALTER COLUMN plant_id SET DEFAULT nextval('public.plant_plant_id_seq'::regclass);


--
-- Name: reservoir reservoir_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.reservoir ALTER COLUMN reservoir_id SET DEFAULT nextval('public.reservoir_reservoir_id_seq'::regclass);


--
-- Name: room room_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.room ALTER COLUMN room_id SET DEFAULT nextval('public.room_room_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: batch; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.batch (batch_id, batch_label, plant_id, timestamp_begin, timestamp_end, weight, lights_on_hour, lights_off_hour, misting_on_second, misting_off_second, remarks) FROM stdin;
10	test_batch1	2	2019-12-31 23:00:00	2020-05-31 23:00:00	200	18	6	15	300	This is test batch 1.
11	test_batch2	2	2021-01-31 17:00:00	2021-03-16 17:00:00	250	16	2	15	300	
\.


--
-- Data for Name: batches_modules; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.batches_modules (batch_id, module_id) FROM stdin;
10	2
10	4
11	4
\.


--
-- Data for Name: batches_nutrients; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.batches_nutrients (batch_id, nutrient_id) FROM stdin;
10	2
10	3
11	2
11	3
\.


--
-- Data for Name: batches_reservoirs; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.batches_reservoirs (batch_id, reservoir_id) FROM stdin;
10	10
11	10
\.


--
-- Data for Name: batches_rooms; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.batches_rooms (batch_id, room_id) FROM stdin;
10	3
11	3
\.


--
-- Data for Name: log_sensor_module; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.log_sensor_module (logged_at, module_id, level, temperature_root, humidity_root) FROM stdin;
2020-05-18 05:56:55.906106	2	1	22.5	80
2020-05-18 05:56:55.906106	2	2	22.5	80
2020-05-23 13:27:59.071689	2	1	22.5	80
2020-05-23 13:27:59.071689	2	2	22.5	80
\.


--
-- Data for Name: log_sensor_reservoir; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.log_sensor_reservoir (logged_at, reservoir_id, tds, temperature_solution, soln_level, ph) FROM stdin;
\.


--
-- Data for Name: log_sensor_room; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.log_sensor_room (logged_at, room_id, temperature, humidity) FROM stdin;
\.


--
-- Data for Name: module; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.module (module_id, reservoir_id, room_id, module_label, level) FROM stdin;
4	0	3	test_module2	2
2	0	0	test_module	2
\.


--
-- Data for Name: module_url; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.module_url ("moduleID", url) FROM stdin;
\.


--
-- Data for Name: nutrient; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.nutrient (nutrient_id, nutrient_label, part, nutrient_type, cc_per_liter, n, p, k) FROM stdin;
3	test_nutrient2	1	2	3	25	25	25
2	test_nutrient	1	1	3	25	25	25
\.


--
-- Data for Name: plant; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.plant (plant_id, plant_label, tds_low, tds_high, ph_low, ph_high, temperature_low, temperature_high, lights_off_hour, lights_on_hour, misting_on_second, misting_off_second) FROM stdin;
0		0	0	0	0	0	0	0	0	0	0
2	Frillice Iceberg	650	700	0	6.79999999999999982	10	24	2	16	3	34
\.


--
-- Data for Name: reservoir; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.reservoir (reservoir_id, reservoir_label) FROM stdin;
0	
10	testreservoir1
\.


--
-- Data for Name: reservoirs_nutrients; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.reservoirs_nutrients (reservoir_id, nutrient_id) FROM stdin;
10	2
10	3
\.


--
-- Data for Name: room; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.room (room_id, room_label) FROM stdin;
0	
3	room1
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.users (user_id, username, hash, salt, is_admin, created_at) FROM stdin;
1	admin	$2a$10$QYwgIoZEwEOl3237zxzET./4JUs5MavYRhg3LGNQmrtiXgKVmSe.G	nNxxuxBM8F5xH2x3BoSvwqwJxLozx6mc	t	2020-05-11 15:11:22.219651
32	test_admin	$2a$10$fxzNDXyZBtxcQHmaxGsYd.cEa5AvOwOSvNL4MyyOQZF0ClWKBIXUC	7jRzJVU1LnvU5VYGFFi9FfmtQxXZCIgA	t	2021-02-22 05:02:38.881198
\.


--
-- Name: batch_batch_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.batch_batch_id_seq', 11, true);


--
-- Name: module_module_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.module_module_id_seq', 4, true);


--
-- Name: nutrient_nutrient_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.nutrient_nutrient_id_seq', 4, true);


--
-- Name: plant_plant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.plant_plant_id_seq', 3, true);


--
-- Name: reservoir_reservoir_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.reservoir_reservoir_id_seq', 10, true);


--
-- Name: room_room_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.room_room_id_seq', 5, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.users_user_id_seq', 32, true);


--
-- Name: batch batch_batch_label_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.batch
    ADD CONSTRAINT batch_batch_label_key UNIQUE (batch_label);


--
-- Name: batch batch_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.batch
    ADD CONSTRAINT batch_pkey PRIMARY KEY (batch_id);


--
-- Name: module module_module_label_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.module
    ADD CONSTRAINT module_module_label_key UNIQUE (module_label);


--
-- Name: module module_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.module
    ADD CONSTRAINT module_pkey PRIMARY KEY (module_id);


--
-- Name: module_url moduleid_url_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.module_url
    ADD CONSTRAINT moduleid_url_pkey UNIQUE ("moduleID", url);


--
-- Name: nutrient nutrient_nutrient_label_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.nutrient
    ADD CONSTRAINT nutrient_nutrient_label_key UNIQUE (nutrient_label);


--
-- Name: nutrient nutrient_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.nutrient
    ADD CONSTRAINT nutrient_pkey PRIMARY KEY (nutrient_id);


--
-- Name: plant plant_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.plant
    ADD CONSTRAINT plant_pkey PRIMARY KEY (plant_id);


--
-- Name: plant plant_plant_label_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.plant
    ADD CONSTRAINT plant_plant_label_key UNIQUE (plant_label);


--
-- Name: reservoirs_nutrients reservoir_nutrients_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.reservoirs_nutrients
    ADD CONSTRAINT reservoir_nutrients_pkey PRIMARY KEY (reservoir_id, nutrient_id);


--
-- Name: reservoir reservoir_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.reservoir
    ADD CONSTRAINT reservoir_pkey PRIMARY KEY (reservoir_id);


--
-- Name: reservoir reservoir_reservoir_label_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.reservoir
    ADD CONSTRAINT reservoir_reservoir_label_key UNIQUE (reservoir_label);


--
-- Name: room room_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.room
    ADD CONSTRAINT room_pkey PRIMARY KEY (room_id);


--
-- Name: room room_room_label_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.room
    ADD CONSTRAINT room_room_label_key UNIQUE (room_label);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: idx_log_sensor_module_level_logged_at; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_log_sensor_module_level_logged_at ON public.log_sensor_module USING btree (logged_at);


--
-- Name: idx_log_sensor_reservoir_logged_at; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_log_sensor_reservoir_logged_at ON public.log_sensor_reservoir USING btree (logged_at);


--
-- Name: idx_log_sensor_room_logged_at; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_log_sensor_room_logged_at ON public.log_sensor_room USING btree (logged_at);


--
-- Name: batch batch_plant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.batch
    ADD CONSTRAINT batch_plant_id_fkey FOREIGN KEY (plant_id) REFERENCES public.plant(plant_id) ON DELETE SET NULL;


--
-- Name: batches_modules batches_modules_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.batches_modules
    ADD CONSTRAINT batches_modules_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.batch(batch_id) ON DELETE CASCADE;


--
-- Name: batches_modules batches_modules_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.batches_modules
    ADD CONSTRAINT batches_modules_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.module(module_id) ON DELETE CASCADE;


--
-- Name: batches_nutrients batches_nutrients_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.batches_nutrients
    ADD CONSTRAINT batches_nutrients_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.batch(batch_id) ON DELETE CASCADE;


--
-- Name: batches_nutrients batches_nutrients_nutrient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.batches_nutrients
    ADD CONSTRAINT batches_nutrients_nutrient_id_fkey FOREIGN KEY (nutrient_id) REFERENCES public.nutrient(nutrient_id) ON DELETE CASCADE;


--
-- Name: batches_reservoirs batches_reservoirs_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.batches_reservoirs
    ADD CONSTRAINT batches_reservoirs_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.batch(batch_id) ON DELETE CASCADE;


--
-- Name: batches_reservoirs batches_reservoirs_reservoir_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.batches_reservoirs
    ADD CONSTRAINT batches_reservoirs_reservoir_id_fkey FOREIGN KEY (reservoir_id) REFERENCES public.reservoir(reservoir_id) ON DELETE CASCADE;


--
-- Name: batches_rooms batches_rooms_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.batches_rooms
    ADD CONSTRAINT batches_rooms_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.batch(batch_id) ON DELETE CASCADE;


--
-- Name: batches_rooms batches_rooms_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.batches_rooms
    ADD CONSTRAINT batches_rooms_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.room(room_id) ON DELETE CASCADE;


--
-- Name: log_sensor_module log_sensor_module_level_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.log_sensor_module
    ADD CONSTRAINT log_sensor_module_level_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.module(module_id) ON DELETE CASCADE;


--
-- Name: log_sensor_reservoir log_sensor_reservoir_reservoir_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.log_sensor_reservoir
    ADD CONSTRAINT log_sensor_reservoir_reservoir_id_fkey FOREIGN KEY (reservoir_id) REFERENCES public.reservoir(reservoir_id) ON DELETE CASCADE;


--
-- Name: log_sensor_room log_sensor_room_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.log_sensor_room
    ADD CONSTRAINT log_sensor_room_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.room(room_id) ON DELETE CASCADE;


--
-- Name: module module_reservoir_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.module
    ADD CONSTRAINT module_reservoir_id_fkey FOREIGN KEY (reservoir_id) REFERENCES public.reservoir(reservoir_id) ON DELETE SET DEFAULT;


--
-- Name: module module_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.module
    ADD CONSTRAINT module_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.room(room_id) ON DELETE SET DEFAULT;


--
-- Name: module_url module_url_module__fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.module_url
    ADD CONSTRAINT module_url_module__fk FOREIGN KEY ("moduleID") REFERENCES public.module(module_id) ON UPDATE CASCADE ON DELETE SET DEFAULT;


--
-- Name: reservoirs_nutrients reservoir_nutrients_nutrient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.reservoirs_nutrients
    ADD CONSTRAINT reservoir_nutrients_nutrient_id_fkey FOREIGN KEY (nutrient_id) REFERENCES public.nutrient(nutrient_id) ON DELETE CASCADE;


--
-- Name: reservoirs_nutrients reservoir_nutrients_reservoir_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.reservoirs_nutrients
    ADD CONSTRAINT reservoir_nutrients_reservoir_id_fkey FOREIGN KEY (reservoir_id) REFERENCES public.reservoir(reservoir_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

