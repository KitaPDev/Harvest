--
-- PostgreSQL database dump
--

-- Dumped from database version 11.5 (Debian 11.5-3.pgdg90+1)
-- Dumped by pg_dump version 12.2

-- Started on 2020-08-09 15:52:26 +07

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

--
-- TOC entry 3021 (class 0 OID 16593)
-- Dependencies: 216
-- Data for Name: plant; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.plant VALUES (0, '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO public.plant VALUES (2, 'Frillice Iceberg', 650, 700, 0, 6.79999999999999982, 10, 24, 2, 16, 3, 34);


--
-- TOC entry 3030 (class 0 OID 17345)
-- Dependencies: 225
-- Data for Name: batch; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.batch VALUES (10, 'test_batch1', 2, '2019-12-31 23:00:00', '2020-05-31 23:00:00', 200, 18, 6, 15, 300, 'This is test batch 1.');


--
-- TOC entry 3023 (class 0 OID 16671)
-- Dependencies: 218
-- Data for Name: reservoir; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.reservoir VALUES (0, '');
INSERT INTO public.reservoir VALUES (10, 'testreservoir1');


--
-- TOC entry 3018 (class 0 OID 16439)
-- Dependencies: 213
-- Data for Name: room; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.room VALUES (0, '');
INSERT INTO public.room VALUES (3, 'room1');


--
-- TOC entry 3025 (class 0 OID 16686)
-- Dependencies: 220
-- Data for Name: module; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.module VALUES (2, 0, 0, 'test_module');
INSERT INTO public.module VALUES (4, 10, 3, 'test_module2');


--
-- TOC entry 3032 (class 0 OID 17390)
-- Dependencies: 227
-- Data for Name: batches_modules; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.batches_modules VALUES (10, 2);
INSERT INTO public.batches_modules VALUES (10, 4);


--
-- TOC entry 3016 (class 0 OID 16402)
-- Dependencies: 211
-- Data for Name: nutrient; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.nutrient VALUES (2, 'test_nutrient', 1, 2, 3, 25, 25, 25);
INSERT INTO public.nutrient VALUES (3, 'test_nutrient2', 1, 2, 3, 25, 25, 25);


--
-- TOC entry 3031 (class 0 OID 17376)
-- Dependencies: 226
-- Data for Name: batches_nutrients; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.batches_nutrients VALUES (10, 2);
INSERT INTO public.batches_nutrients VALUES (10, 3);


--
-- TOC entry 3033 (class 0 OID 17405)
-- Dependencies: 228
-- Data for Name: batches_reservoirs; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.batches_reservoirs VALUES (10, 10);


--
-- TOC entry 3034 (class 0 OID 17418)
-- Dependencies: 229
-- Data for Name: batches_rooms; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.batches_rooms VALUES (10, 3);


--
-- TOC entry 3027 (class 0 OID 17001)
-- Dependencies: 222
-- Data for Name: log_sensor_module_level; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.log_sensor_module_level VALUES ('2020-05-18 05:56:55.906106', 2, 1, 22.5, 80, 20000);
INSERT INTO public.log_sensor_module_level VALUES ('2020-05-18 05:56:55.906106', 2, 2, 22.5, 80, 20000);
INSERT INTO public.log_sensor_module_level VALUES ('2020-05-23 13:27:59.071689', 2, 1, 22.5, 80, 20000);
INSERT INTO public.log_sensor_module_level VALUES ('2020-05-23 13:27:59.071689', 2, 2, 22.5, 80, 20000);


--
-- TOC entry 3026 (class 0 OID 16751)
-- Dependencies: 221
-- Data for Name: log_sensor_reservoir; Type: TABLE DATA; Schema: public; Owner: admin
--



--
-- TOC entry 3019 (class 0 OID 16561)
-- Dependencies: 214
-- Data for Name: log_sensor_room; Type: TABLE DATA; Schema: public; Owner: admin
--



--
-- TOC entry 3028 (class 0 OID 17168)
-- Dependencies: 223
-- Data for Name: reservoirs_nutrients; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.reservoirs_nutrients VALUES (10, 2);
INSERT INTO public.reservoirs_nutrients VALUES (10, 3);


--
-- TOC entry 3014 (class 0 OID 16387)
-- Dependencies: 209
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.users VALUES (24, 'admin3', '$2a$10$rKLiuaKq7m7LrgmVOSozEeo5eAxzo/OspnQgHh9d3Svq7kiLcsBX.', 'WSW35vWJW9LndVIu7bdnQhL8AjWtLGsx', true, '2020-06-12 15:13:50.633672');
INSERT INTO public.users VALUES (1, 'admin', '$2a$10$QYwgIoZEwEOl3237zxzET./4JUs5MavYRhg3LGNQmrtiXgKVmSe.G', 'nNxxuxBM8F5xH2x3BoSvwqwJxLozx6mc', true, '2020-05-11 15:11:22.219651');
INSERT INTO public.users VALUES (30, 'admin2', '$2a$10$wRZ2lOMvDv/1N1pryZm0VOJ3YYxI1oUT07QeW0635/V5bwFpMfTp6', 'meopen7VsFbGCQUxV3gAz5n1yY3DEWKv', true, '2020-06-12 15:23:16.851972');
INSERT INTO public.users VALUES (31, 'admin4', '$2a$10$nrPKUAuqbCrNmcDLYkmVcOJIjMH0F968UwbZNoL00Fpl/bGFDUNpm', 'L1duhF1aZPhniHnhcP9oZoP10ntRe0l5', false, '2020-06-13 05:35:16.125752');
INSERT INTO public.users VALUES (20, 'admin1', '$2a$10$XqS7CbQhnDeQZGz8cAcn3.k4iyBMr62EYGhZEFWbrVUrfYWfe77Du', 'saWOEomtB8cwWcJwZJedrKWNIu7FOf2N', true, '2020-06-12 15:05:42.240872');


--
-- TOC entry 3040 (class 0 OID 0)
-- Dependencies: 224
-- Name: batch_batch_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.batch_batch_id_seq', 10, true);


--
-- TOC entry 3041 (class 0 OID 0)
-- Dependencies: 219
-- Name: module_module_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.module_module_id_seq', 4, true);


--
-- TOC entry 3042 (class 0 OID 0)
-- Dependencies: 210
-- Name: nutrient_nutrient_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.nutrient_nutrient_id_seq', 4, true);


--
-- TOC entry 3043 (class 0 OID 0)
-- Dependencies: 215
-- Name: plant_plant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.plant_plant_id_seq', 3, true);


--
-- TOC entry 3044 (class 0 OID 0)
-- Dependencies: 217
-- Name: reservoir_reservoir_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.reservoir_reservoir_id_seq', 10, true);


--
-- TOC entry 3045 (class 0 OID 0)
-- Dependencies: 212
-- Name: room_room_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.room_room_id_seq', 5, true);


--
-- TOC entry 3046 (class 0 OID 0)
-- Dependencies: 208
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.users_user_id_seq', 31, true);


-- Completed on 2020-08-09 15:52:27 +07

--
-- PostgreSQL database dump complete
--

