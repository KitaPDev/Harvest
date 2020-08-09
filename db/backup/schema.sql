--
-- PostgreSQL database dump
--

-- Dumped from database version 11.5 (Debian 11.5-3.pgdg90+1)
-- Dumped by pg_dump version 12.2

-- Started on 2020-08-09 15:48:23 +07

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
-- TOC entry 225 (class 1259 OID 17345)
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
-- TOC entry 224 (class 1259 OID 17343)
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
-- TOC entry 3018 (class 0 OID 0)
-- Dependencies: 224
-- Name: batch_batch_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.batch_batch_id_seq OWNED BY public.batch.batch_id;


--
-- TOC entry 227 (class 1259 OID 17390)
-- Name: batches_modules; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.batches_modules (
    batch_id integer,
    module_id integer
);


ALTER TABLE public.batches_modules OWNER TO admin;

--
-- TOC entry 226 (class 1259 OID 17376)
-- Name: batches_nutrients; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.batches_nutrients (
    batch_id integer,
    nutrient_id integer
);


ALTER TABLE public.batches_nutrients OWNER TO admin;

--
-- TOC entry 228 (class 1259 OID 17405)
-- Name: batches_reservoirs; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.batches_reservoirs (
    batch_id integer,
    reservoir_id integer
);


ALTER TABLE public.batches_reservoirs OWNER TO admin;

--
-- TOC entry 229 (class 1259 OID 17418)
-- Name: batches_rooms; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.batches_rooms (
    batch_id integer,
    room_id integer
);


ALTER TABLE public.batches_rooms OWNER TO admin;

--
-- TOC entry 222 (class 1259 OID 17001)
-- Name: log_sensor_module_level; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.log_sensor_module_level (
    logged_at timestamp without time zone DEFAULT now() NOT NULL,
    module_id integer NOT NULL,
    level integer NOT NULL,
    temperature double precision NOT NULL,
    humidity double precision NOT NULL,
    lux double precision NOT NULL,
    CONSTRAINT log_sensor_module_level_level_check CHECK ((level > 0))
);


ALTER TABLE public.log_sensor_module_level OWNER TO admin;

--
-- TOC entry 221 (class 1259 OID 16751)
-- Name: log_sensor_reservoir; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.log_sensor_reservoir (
    logged_at timestamp without time zone DEFAULT now() NOT NULL,
    reservoir_id integer NOT NULL,
    tds double precision NOT NULL,
    soln_temp double precision NOT NULL,
    soln_level double precision NOT NULL,
    ph double precision NOT NULL
);


ALTER TABLE public.log_sensor_reservoir OWNER TO admin;

--
-- TOC entry 214 (class 1259 OID 16561)
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
-- TOC entry 220 (class 1259 OID 16686)
-- Name: module; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.module (
    module_id integer NOT NULL,
    reservoir_id integer DEFAULT 0 NOT NULL,
    room_id integer DEFAULT 0 NOT NULL,
    module_label character varying(256) NOT NULL
);


ALTER TABLE public.module OWNER TO admin;

--
-- TOC entry 219 (class 1259 OID 16684)
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
-- TOC entry 3019 (class 0 OID 0)
-- Dependencies: 219
-- Name: module_module_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.module_module_id_seq OWNED BY public.module.module_id;


--
-- TOC entry 211 (class 1259 OID 16402)
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
-- TOC entry 210 (class 1259 OID 16400)
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
-- TOC entry 3020 (class 0 OID 0)
-- Dependencies: 210
-- Name: nutrient_nutrient_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.nutrient_nutrient_id_seq OWNED BY public.nutrient.nutrient_id;


--
-- TOC entry 216 (class 1259 OID 16593)
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
-- TOC entry 215 (class 1259 OID 16591)
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
-- TOC entry 3021 (class 0 OID 0)
-- Dependencies: 215
-- Name: plant_plant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.plant_plant_id_seq OWNED BY public.plant.plant_id;


--
-- TOC entry 218 (class 1259 OID 16671)
-- Name: reservoir; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.reservoir (
    reservoir_id integer NOT NULL,
    reservoir_label character varying(256) NOT NULL
);


ALTER TABLE public.reservoir OWNER TO admin;

--
-- TOC entry 217 (class 1259 OID 16669)
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
-- TOC entry 3022 (class 0 OID 0)
-- Dependencies: 217
-- Name: reservoir_reservoir_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.reservoir_reservoir_id_seq OWNED BY public.reservoir.reservoir_id;


--
-- TOC entry 223 (class 1259 OID 17168)
-- Name: reservoirs_nutrients; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.reservoirs_nutrients (
    reservoir_id integer NOT NULL,
    nutrient_id integer NOT NULL
);


ALTER TABLE public.reservoirs_nutrients OWNER TO admin;

--
-- TOC entry 213 (class 1259 OID 16439)
-- Name: room; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.room (
    room_id integer NOT NULL,
    room_label character varying(256) NOT NULL
);


ALTER TABLE public.room OWNER TO admin;

--
-- TOC entry 212 (class 1259 OID 16437)
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
-- TOC entry 3023 (class 0 OID 0)
-- Dependencies: 212
-- Name: room_room_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.room_room_id_seq OWNED BY public.room.room_id;


--
-- TOC entry 209 (class 1259 OID 16387)
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
-- TOC entry 208 (class 1259 OID 16385)
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
-- TOC entry 3024 (class 0 OID 0)
-- Dependencies: 208
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 2841 (class 2604 OID 17348)
-- Name: batch batch_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.batch ALTER COLUMN batch_id SET DEFAULT nextval('public.batch_batch_id_seq'::regclass);


--
-- TOC entry 2835 (class 2604 OID 16689)
-- Name: module module_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.module ALTER COLUMN module_id SET DEFAULT nextval('public.module_module_id_seq'::regclass);


--
-- TOC entry 2826 (class 2604 OID 16405)
-- Name: nutrient nutrient_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.nutrient ALTER COLUMN nutrient_id SET DEFAULT nextval('public.nutrient_nutrient_id_seq'::regclass);


--
-- TOC entry 2831 (class 2604 OID 16596)
-- Name: plant plant_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.plant ALTER COLUMN plant_id SET DEFAULT nextval('public.plant_plant_id_seq'::regclass);


--
-- TOC entry 2834 (class 2604 OID 16674)
-- Name: reservoir reservoir_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.reservoir ALTER COLUMN reservoir_id SET DEFAULT nextval('public.reservoir_reservoir_id_seq'::regclass);


--
-- TOC entry 2829 (class 2604 OID 16442)
-- Name: room room_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.room ALTER COLUMN room_id SET DEFAULT nextval('public.room_room_id_seq'::regclass);


--
-- TOC entry 2823 (class 2604 OID 16390)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 2873 (class 2606 OID 17355)
-- Name: batch batch_batch_label_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.batch
    ADD CONSTRAINT batch_batch_label_key UNIQUE (batch_label);


--
-- TOC entry 2875 (class 2606 OID 17353)
-- Name: batch batch_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.batch
    ADD CONSTRAINT batch_pkey PRIMARY KEY (batch_id);


--
-- TOC entry 2865 (class 2606 OID 16703)
-- Name: module module_module_label_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.module
    ADD CONSTRAINT module_module_label_key UNIQUE (module_label);


--
-- TOC entry 2867 (class 2606 OID 16701)
-- Name: module module_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.module
    ADD CONSTRAINT module_pkey PRIMARY KEY (module_id);


--
-- TOC entry 2848 (class 2606 OID 16411)
-- Name: nutrient nutrient_nutrient_label_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.nutrient
    ADD CONSTRAINT nutrient_nutrient_label_key UNIQUE (nutrient_label);


--
-- TOC entry 2850 (class 2606 OID 16409)
-- Name: nutrient nutrient_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.nutrient
    ADD CONSTRAINT nutrient_pkey PRIMARY KEY (nutrient_id);


--
-- TOC entry 2857 (class 2606 OID 16598)
-- Name: plant plant_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.plant
    ADD CONSTRAINT plant_pkey PRIMARY KEY (plant_id);


--
-- TOC entry 2859 (class 2606 OID 16600)
-- Name: plant plant_plant_label_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.plant
    ADD CONSTRAINT plant_plant_label_key UNIQUE (plant_label);


--
-- TOC entry 2871 (class 2606 OID 17172)
-- Name: reservoirs_nutrients reservoir_nutrients_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.reservoirs_nutrients
    ADD CONSTRAINT reservoir_nutrients_pkey PRIMARY KEY (reservoir_id, nutrient_id);


--
-- TOC entry 2861 (class 2606 OID 16676)
-- Name: reservoir reservoir_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.reservoir
    ADD CONSTRAINT reservoir_pkey PRIMARY KEY (reservoir_id);


--
-- TOC entry 2863 (class 2606 OID 16678)
-- Name: reservoir reservoir_reservoir_label_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.reservoir
    ADD CONSTRAINT reservoir_reservoir_label_key UNIQUE (reservoir_label);


--
-- TOC entry 2852 (class 2606 OID 16444)
-- Name: room room_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.room
    ADD CONSTRAINT room_pkey PRIMARY KEY (room_id);


--
-- TOC entry 2854 (class 2606 OID 16446)
-- Name: room room_room_label_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.room
    ADD CONSTRAINT room_room_label_key UNIQUE (room_label);


--
-- TOC entry 2844 (class 2606 OID 16397)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 2846 (class 2606 OID 16399)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 2869 (class 1259 OID 17038)
-- Name: idx_log_sensor_module_level_logged_at; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_log_sensor_module_level_logged_at ON public.log_sensor_module_level USING btree (logged_at);


--
-- TOC entry 2868 (class 1259 OID 17068)
-- Name: idx_log_sensor_reservoir_logged_at; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_log_sensor_reservoir_logged_at ON public.log_sensor_reservoir USING btree (logged_at);


--
-- TOC entry 2855 (class 1259 OID 17069)
-- Name: idx_log_sensor_room_logged_at; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_log_sensor_room_logged_at ON public.log_sensor_room USING btree (logged_at);


--
-- TOC entry 2883 (class 2606 OID 17361)
-- Name: batch batch_plant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.batch
    ADD CONSTRAINT batch_plant_id_fkey FOREIGN KEY (plant_id) REFERENCES public.plant(plant_id) ON DELETE SET NULL;


--
-- TOC entry 2886 (class 2606 OID 17460)
-- Name: batches_modules batches_modules_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.batches_modules
    ADD CONSTRAINT batches_modules_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.batch(batch_id) ON DELETE CASCADE;


--
-- TOC entry 2887 (class 2606 OID 17465)
-- Name: batches_modules batches_modules_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.batches_modules
    ADD CONSTRAINT batches_modules_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.module(module_id) ON DELETE CASCADE;


--
-- TOC entry 2884 (class 2606 OID 17470)
-- Name: batches_nutrients batches_nutrients_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.batches_nutrients
    ADD CONSTRAINT batches_nutrients_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.batch(batch_id) ON DELETE CASCADE;


--
-- TOC entry 2885 (class 2606 OID 17475)
-- Name: batches_nutrients batches_nutrients_nutrient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.batches_nutrients
    ADD CONSTRAINT batches_nutrients_nutrient_id_fkey FOREIGN KEY (nutrient_id) REFERENCES public.nutrient(nutrient_id) ON DELETE CASCADE;


--
-- TOC entry 2888 (class 2606 OID 17480)
-- Name: batches_reservoirs batches_reservoirs_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.batches_reservoirs
    ADD CONSTRAINT batches_reservoirs_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.batch(batch_id) ON DELETE CASCADE;


--
-- TOC entry 2889 (class 2606 OID 17485)
-- Name: batches_reservoirs batches_reservoirs_reservoir_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.batches_reservoirs
    ADD CONSTRAINT batches_reservoirs_reservoir_id_fkey FOREIGN KEY (reservoir_id) REFERENCES public.reservoir(reservoir_id) ON DELETE CASCADE;


--
-- TOC entry 2890 (class 2606 OID 17490)
-- Name: batches_rooms batches_rooms_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.batches_rooms
    ADD CONSTRAINT batches_rooms_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.batch(batch_id) ON DELETE CASCADE;


--
-- TOC entry 2891 (class 2606 OID 17495)
-- Name: batches_rooms batches_rooms_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.batches_rooms
    ADD CONSTRAINT batches_rooms_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.room(room_id) ON DELETE CASCADE;


--
-- TOC entry 2880 (class 2606 OID 17436)
-- Name: log_sensor_module_level log_sensor_module_level_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.log_sensor_module_level
    ADD CONSTRAINT log_sensor_module_level_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.module(module_id) ON DELETE CASCADE;


--
-- TOC entry 2879 (class 2606 OID 17441)
-- Name: log_sensor_reservoir log_sensor_reservoir_reservoir_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.log_sensor_reservoir
    ADD CONSTRAINT log_sensor_reservoir_reservoir_id_fkey FOREIGN KEY (reservoir_id) REFERENCES public.reservoir(reservoir_id) ON DELETE CASCADE;


--
-- TOC entry 2876 (class 2606 OID 17431)
-- Name: log_sensor_room log_sensor_room_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.log_sensor_room
    ADD CONSTRAINT log_sensor_room_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.room(room_id) ON DELETE CASCADE;


--
-- TOC entry 2878 (class 2606 OID 17455)
-- Name: module module_reservoir_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.module
    ADD CONSTRAINT module_reservoir_id_fkey FOREIGN KEY (reservoir_id) REFERENCES public.reservoir(reservoir_id) ON DELETE SET DEFAULT;


--
-- TOC entry 2877 (class 2606 OID 17450)
-- Name: module module_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.module
    ADD CONSTRAINT module_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.room(room_id) ON DELETE SET DEFAULT;


--
-- TOC entry 2882 (class 2606 OID 17178)
-- Name: reservoirs_nutrients reservoir_nutrients_nutrient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.reservoirs_nutrients
    ADD CONSTRAINT reservoir_nutrients_nutrient_id_fkey FOREIGN KEY (nutrient_id) REFERENCES public.nutrient(nutrient_id) ON DELETE CASCADE;


--
-- TOC entry 2881 (class 2606 OID 17173)
-- Name: reservoirs_nutrients reservoir_nutrients_reservoir_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.reservoirs_nutrients
    ADD CONSTRAINT reservoir_nutrients_reservoir_id_fkey FOREIGN KEY (reservoir_id) REFERENCES public.reservoir(reservoir_id) ON DELETE CASCADE;


-- Completed on 2020-08-09 15:48:24 +07

--
-- PostgreSQL database dump complete
--

