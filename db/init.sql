CREATE TABLE users (
    user_id SERIAL NOT NULL,
    username VARCHAR(256) NOT NULL,
    hash VARCHAR(256) NOT NULL,
    salt VARCHAR(256) NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id),
    UNIQUE (username)
);

CREATE TABLE nutrient (
    nutrient_id SERIAL NOT NULL,
    nutrient_label VARCHAR(256) NOT NULL,
    part INTEGER NOT NULL CHECK (
        part >= 1
        AND part <= 3
    ),
    nutrient_type INTEGER NOT NULL CHECK (
        nutrient_type >= 1
        AND nutrient_type <= 2
    ),
    cc_per_liter FLOAT NOT NULL,
    n FLOAT NOT NULL,
    p FLOAT NOT NULL,
    k FLOAT NOT NULL,
    PRIMARY KEY (nutrient_id),
    UNIQUE (nutrient_label)
);

CREATE TABLE room (
    room_id SERIAL NOT NULL,
    room_label VARCHAR(256) NOT NULL,
    PRIMARY KEY (room_id),
    UNIQUE (room_label)
);

CREATE TABLE plant (
    plant_id SERIAL NOT NULL,
    plant_label VARCHAR(256) NOT NULL,
    tds_low FLOAT NOT NULL,
    tds_high FLOAT NOT NULL,
    ph_low FLOAT NOT NULL,
    ph_high FLOAT NOT NULL,
    temperature_low FLOAT NOT NULL,
    temperature_high FLOAT NOT NULL,
    lights_off_hour FLOAT NOT NULL,
    lights_on_hour FLOAT NOT NULL,
    misting_on_second FLOAT NOT NULL,
    misting_off_second FLOAT NOT NULL,
    PRIMARY KEY (plant_id),
    UNIQUE (plant_label)
);


CREATE TABLE reservoir (
    reservoir_id SERIAL NOT NULL,
    reservoir_label VARCHAR(256) NOT NULL,
    PRIMARY KEY (reservoir_id),
    UNIQUE (reservoir_label)
);

CREATE TABLE reservoirs_nutrients (
    reservoir_id INTEGER NOT NULL,
    nutrient_id INTEGER NOT NULL,
    PRIMARY KEY (reservoir_id, nutrient_id),
    FOREIGN KEY (reservoir_id) REFERENCES reservoir (reservoir_id)
        ON DELETE CASCADE,
    FOREIGN KEY (nutrient_id) REFERENCES nutrient (nutrient_id)
        ON DELETE CASCADE
);

CREATE TABLE module (
    module_id SERIAL NOT NULL,
    module_label VARCHAR(256) NOT NULL,
    reservoir_id INTEGER NOT NULL  DEFAULT 0,
    room_id INTEGER NOT NULL  DEFAULT 0,
    PRIMARY KEY (module_id),
    UNIQUE (module_label),
    FOREIGN KEY (reservoir_id) REFERENCES reservoir (reservoir_id)
        ON DELETE SET DEFAULT,
    FOREIGN KEY (room_id) REFERENCES room (room_id)
        ON DELETE SET DEFAULT
);

CREATE TABLE batch (
   batch_id SERIAL NOT NULL,
   batch_label VARCHAR(256) NOT NULL,
   timestamp_begin TIMESTAMP NOT NULL,
   timestamp_end TIMESTAMP NOT NULL,
   weight FLOAT NOT NULL,
   lights_on_hour FLOAT NOT NULL,
   lights_off_hour FLOAT NOT NULL,
   misting_on_second FLOAT NOT NULL,
   misting_off_second FLOAT NOT NULL,
   remarks VARCHAR(1024),
   PRIMARY KEY (batch_id),
   UNIQUE (batch_label),
   FOREIGN KEY (plant_id) REFERENCES plant (plant_id)
    ON DELETE SET DEFAULT,
   FOREIGN KEY (reservoir_id) REFERENCES reservoir (reservoir_id)
    ON DELETE SET DEFAULT,
   FOREIGN KEY (room_id) REFERENCES room (room_id)
    ON DELETE SET DEFAULT
);

CREATE TABLE batches_nutrients (
    batch_id INTEGER,
    nutrient_id INTEGER,
   FOREIGN KEY (batch_id) REFERENCES batch (batch_id)
       ON DELETE CASCADE,
   FOREIGN KEY (nutrient_id) REFERENCES nutrient (nutrient_id)
       ON DELETE CASCADE
);

CREATE TABLE batches_modules (
    batch_id INTEGER,
    module_id INTEGER,
   FOREIGN KEY (batch_id) REFERENCES batch (batch_id)
       ON DELETE CASCADE,
   FOREIGN KEY (module_id) REFERENCES module (module_id)
       ON DELETE CASCADE
);

CREATE TABLE batches_reservoirs (
    batch_id INTEGER,
    reservoir_id INTEGER,
   FOREIGN KEY (batch_id) REFERENCES batch (batch_id)
       ON DELETE CASCADE,
   FOREIGN KEY (reservoir_id) REFERENCES reservoir (reservoir_id)
       ON DELETE CASCADE
);

CREATE TABLE batches_rooms (
    batch_id INTEGER,
    room_id INTEGER,
   FOREIGN KEY (batch_id) REFERENCES batch (batch_id)
       ON DELETE CASCADE,
   FOREIGN KEY (room_id) REFERENCES room (room_id)
       ON DELETE CASCADE
);

CREATE TABLE log_sensor_module_level (
    logged_at TIMESTAMP NOT NULL DEFAULT NOW(),
    module_id INTEGER NOT NULL,
    level INTEGER NOT NULL CHECK (level > 0),
    temperature FLOAT NOT NULL,
    humidity FLOAT NOT NULL,
    lux FLOAT NOT NULL,
    FOREIGN KEY (module_id) REFERENCES module (module_id)
        ON DELETE CASCADE
);

CREATE TABLE log_sensor_module (
    logged_at TIMESTAMP NOT NULL DEFAULT NOW(),
    module_id INTEGER NOT NULL,
    pressure FLOAT NOT NULL,
    FOREIGN KEY (module_id) REFERENCES module (module_id)
        ON DELETE CASCADE
);

CREATE TABLE log_sensor_reservoir (
    logged_at TIMESTAMP NOT NULL DEFAULT NOW(),
    reservoir_id INTEGER NOT NULL,
    tds FLOAT NOT NULL,
    ph FLOAT NOT NULL,
    soln_temp FLOAT NOT NULL,
    soln_level FLOAT NOT NULL,
    FOREIGN KEY (reservoir_id) REFERENCES reservoir (reservoir_id)
        ON DELETE CASCADE
);

CREATE TABLE log_sensor_room (
    logged_at TIMESTAMP NOT NULL DEFAULT NOW(),
    room_id INTEGER NOT NULL,
    temperature FLOAT NOT NULL,
    humidity FLOAT NOT NULL,
    FOREIGN KEY (room_id) REFERENCES room (room_id)
        ON DELETE CASCADE
);

CREATE INDEX idx_log_sensor_module_level_logged_at ON log_sensor_module_level (logged_at);
CREATE INDEX idx_log_sensor_module_logged_at ON log_sensor_module (logged_at);
CREATE INDEX idx_log_sensor_reservoir_logged_at ON log_sensor_reservoir (logged_at);
CREATE INDEX idx_log_sensor_room_logged_at ON log_sensor_room (logged_at);

INSERT INTO room (room_id, room_label) VALUES (0, '');
INSERT INTO reservoir (reservoir_id, reservoir_label) VALUES (0, '');
INSERT INTO plant (plant_id, plant_label, tds_low, tds_high, ph_low, ph_high, temperature_low, temperature_high, lights_off_hour, lights_on_hour) VALUES (0, '', 0, 0, 0, 0, 0, 0, 0, 0);