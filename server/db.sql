-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'product'
--
-- ---

  DROP TABLE IF EXISTS product, features, styles, photos, skus CASCADE;

  CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    slogan VARCHAR,
    description VARCHAR,
    category VARCHAR,
    default_price INT
  );

  CREATE TABLE features (
    id INT PRIMARY KEY,
    product_id INTEGER NOT NULL,
    feature VARCHAR,
    value VARCHAR
  );

   CREATE TABLE styles (
    id INT PRIMARY KEY,
    product_id INTEGER NOT NULL,
    name VARCHAR,
    sale_price VARCHAR,
    original_price INT,
    default_style VARCHAR
   );

  CREATE TABLE photos (
    id INT PRIMARY KEY,
    style_id INT NOT NULL,
    url VARCHAR,
    thumbnail_url VARCHAR
  );

  CREATE TABLE skus (
    id INT PRIMARY KEY,
    style_id INT NOT NULL,
    size VARCHAR,
    quantity INT
  );

-- ---
-- Table 'reviews'
--
-- ---

DROP TABLE IF EXISTS reviews CASCADE;

CREATE TABLE reviews (
  review_id SERIAL,
  product_id INTEGER NOT NULL,
  rating INTEGER NOT NULL,
  date BIGINT NOT NULL,
  summary TEXT NOT NULL,
  body TEXT NOT NULL,
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN NOT NULL,
  reviewer_name TEXT NOT NULL,
  reviewer_email TEXT NOT NULL,
  response TEXT NOT NULL,
  helpfulness INTEGER NOT NULL,
  PRIMARY KEY (review_id)
);

-- ---
-- Table 'question'
--
-- ---

DROP TABLE IF EXISTS question CASCADE;

CREATE TABLE question (
  id SERIAL,
  product_id INTEGER NOT NULL,
  body TEXT NOT NULL,
  date_written BIGINT NOT NULL,
  asker_name TEXT NOT NULL,
  asker_email TEXT NOT NULL,
  reported BOOLEAN NOT NULL,
  helpful INT NOT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Table 'answer'
--
-- ---

DROP TABLE IF EXISTS answer CASCADE;

CREATE TABLE answer (
  id SERIAL,
  id_question INTEGER NOT NULL,
  body TEXT NOT NULL,
  date_written BIGINT NOT NULL,
  answerer_name TEXT NOT NULL,
  answerer_email TEXT NOT NULL,
  reported BOOLEAN NOT NULL,
  helpful INTEGER NOT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Table 'archived-answers'
--
-- ---

DROP TABLE IF EXISTS archived_answers CASCADE;

CREATE TABLE archived_answers (
  id_answer INTEGER NOT NULL,
  id SERIAL,
  PRIMARY KEY (id)
);

-- ---
-- Table 'archived-questions'
--
-- ---

DROP TABLE IF EXISTS archived_questions CASCADE;

CREATE TABLE archived_questions (
  id SERIAL,
  id_question INTEGER NOT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Table 'answer-photos'
--
-- ---

DROP TABLE IF EXISTS answer_photos CASCADE;

CREATE TABLE answer_photos (
  id SERIAL,
  id_answer INTEGER NOT NULL,
  url TEXT NOT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Table 'Review-Photos'
--
-- ---

DROP TABLE IF EXISTS review_photos CASCADE;

CREATE TABLE review_photos (
  id SERIAL,
  id_reviews INTEGER NOT NULL,
  url TEXT NOT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Table 'archived-reviews'
--
-- ---

DROP TABLE IF EXISTS archived_reviews CASCADE;

CREATE TABLE archived_reviews(
  id SERIAL,
  id_reviews INTEGER NOT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Table 'reviews-meta-data'
--
-- ---

DROP TABLE IF EXISTS reviews_meta_data CASCADE;

CREATE TABLE reviews_meta_data (
  id SERIAL,
  product_id INTEGER NULL,
  PRIMARY KEY (id)
);


-- ---
-- Table 'ratings'
--
-- ---

DROP TABLE IF EXISTS ratings CASCADE;

CREATE TABLE ratings (
  id SERIAL,
  id_reviews_meta_data INTEGER NOT NULL,
  one INTEGER NOT NULL,
  two INTEGER NOT NULL,
  three INTEGER NOT NULL,
  four INTEGER NOT NULL,
  five INTEGER NOT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Table 'recommended-meta'
--
-- ---

DROP TABLE IF EXISTS recommended_meta CASCADE;

CREATE TABLE recommended_meta (
  id SERIAL,
  id_reviews_meta_data INTEGER NOT NULL,
  zero INTEGER NOT NULL,
  one INTEGER NOT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Table 'characteristics'
--
-- ---

DROP TABLE IF EXISTS characteristics CASCADE;

CREATE TABLE characteristics (
  id SERIAL,
  product_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Table 'characteristic-rating'
--
-- ---

DROP TABLE IF EXISTS characteristic_rating CASCADE;

CREATE TABLE characteristic_rating (
  id SERIAL,
  id_characteristics INTEGER NOT NULL,
  id_reviews INTEGER NOT NULL,
  value INTEGER NOT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Foreign Keys
-- ---

ALTER TABLE reviews ADD FOREIGN KEY (product_id) REFERENCES product (id);
ALTER TABLE question ADD FOREIGN KEY (product_id) REFERENCES product (id);
ALTER TABLE answer ADD FOREIGN KEY (id_question) REFERENCES question (id);
ALTER TABLE archived_answers ADD FOREIGN KEY (id_answer) REFERENCES answer (id);
ALTER TABLE archived_questions ADD FOREIGN KEY (id_question) REFERENCES question (id);
ALTER TABLE answer_photos ADD FOREIGN KEY (id_answer) REFERENCES answer (id);
ALTER TABLE review_photos ADD FOREIGN KEY (id_reviews) REFERENCES reviews (review_id);
ALTER TABLE reviews_meta_data ADD FOREIGN KEY (product_id) REFERENCES product (id);
ALTER TABLE ratings ADD FOREIGN KEY (id_reviews_meta_data) REFERENCES reviews_meta_data (id);
ALTER TABLE recommended_meta ADD FOREIGN KEY (id_reviews_meta_data) REFERENCES reviews_meta_data (id);
ALTER TABLE characteristics ADD FOREIGN KEY (product_id) REFERENCES product (id);
ALTER TABLE characteristic_rating ADD FOREIGN KEY (id_characteristics) REFERENCES characteristics (id);
ALTER TABLE characteristic_rating ADD FOREIGN KEY (id_reviews) REFERENCES reviews (review_id);
ALTER TABLE features ADD FOREIGN KEY (product_id) REFERENCES product (id);
ALTER TABLE styles ADD FOREIGN KEY (product_id) REFERENCES product (id);
ALTER TABLE photos ADD FOREIGN KEY (style_id) REFERENCES styles (id);
ALTER TABLE skus ADD FOREIGN KEY (style_id) REFERENCES styles (id);

-- ---
-- Copy and Load
-- ---

\COPY product FROM 'server/csv-data/product.csv' DELIMITER ',' CSV HEADER;
\COPY reviews FROM 'server/csv-data/reviews.csv' DELIMITER ',' CSV HEADER;
\COPY features FROM 'server/csv-data/features.csv' DELIMITER ',' CSV HEADER;
\COPY styles FROM 'server/csv-data/styles.csv' DELIMITER ',' CSV HEADER;
\COPY question FROM 'server/csv-data/questions.csv' DELIMITER ',' CSV HEADER;
\COPY characteristics FROM 'server/csv-data/characteristics.csv' DELIMITER ',' CSV HEADER;
\COPY characteristic_rating FROM 'server/csv-data/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;
\COPY answer FROM 'server/csv-data/answers.csv' DELIMITER ',' CSV HEADER;
\COPY answer_photos FROM 'server/csv-data/answers_photos.csv' DELIMITER ',' CSV HEADER;
\COPY review_photos FROM 'server/csv-data/reviews_photos.csv' DELIMITER ',' CSV HEADER;
\COPY photos FROM 'server/csv-data/photos.csv' DELIMITER ',' CSV HEADER;
\COPY skus FROM 'server/csv-data/skus.csv' DELIMITER ',' CSV HEADER;

alter table question alter column date_written type timestamp using TIMEZONE('UTC', TO_TIMESTAMP(date_written / 1000 ));
alter table answer alter column date_written type timestamp using TIMEZONE('UTC', TO_TIMESTAMP(date_written / 1000 ));
alter table reviews alter column date type timestamp using TIMEZONE('UTC', TO_TIMESTAMP(date / 1000 ));

DO $$
BEGIN
  EXECUTE 'ALTER SEQUENCE ' || pg_get_serial_sequence('question', 'id') ||
    ' RESTART WITH ' || (SELECT MAX(id) + 1 FROM question);
END $$;
DO $$
BEGIN
  EXECUTE 'ALTER SEQUENCE ' || pg_get_serial_sequence('answer', 'id') ||
    ' RESTART WITH ' || (SELECT MAX(id) + 1 FROM answer);
END $$;
DO $$
BEGIN
  EXECUTE 'ALTER SEQUENCE ' || pg_get_serial_sequence('reviews', 'review_id') ||
    ' RESTART WITH ' || (SELECT MAX(review_id) + 1 FROM reviews);
END $$;
DO $$
BEGIN
  EXECUTE 'ALTER SEQUENCE ' || pg_get_serial_sequence('characteristic_rating', 'id') ||
    ' RESTART WITH ' || (SELECT MAX(id) + 1 FROM characteristic_rating);
END $$;
DO $$
BEGIN
  EXECUTE 'ALTER SEQUENCE ' || pg_get_serial_sequence('review_photos', 'id') ||
    ' RESTART WITH ' || (SELECT MAX(id) + 1 FROM review_photos);
END $$;

-- Indexing for QA Section
CREATE INDEX idx_question_product_id ON question (product_id);
CREATE INDEX idx_question_reported ON question (reported);

CREATE INDEX idx_answer_id_question ON answer (id_question);
CREATE INDEX idx_answer_reported ON answer (reported);

CREATE INDEX idx_answer_photos_id_answer ON answer_photos (id_answer);
CREATE INDEX idx_product_id ON product(id);
CREATE INDEX idx_style_id ON styles(id);
CREATE INDEX idx_photos_style_id ON photos(style_id);
CREATE INDEX idx_skus_style_id ON skus(style_id);
CREATE INDEX idx_features_product_id ON features(product_id);
CREATE INDEX idx_styles_product_id ON styles(product_id);
CREATE INDEX idx_characteristics_product_id ON characteristics (product_id);
CREATE INDEX idx_reviews_product_id ON reviews (product_id);
CREATE INDEX idx_reviews_response ON reviews (reported);
CREATE INDEX idx_review_photos_id ON review_photos (id);
CREATE INDEX idx_review_photos_id_reviews ON review_photos (id_reviews);
CREATE INDEX idx_reviews_review_id ON reviews (review_id);

CREATE INDEX idx_charateristic_rating_id ON characteristic_rating (id_characteristics);

-- Table Properties
-- ---

-- ALTER TABLE product ENGINE=InnoDB CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE Product Information ENGINE=InnoDB CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE   reviews ENGINE=InnoDB CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE question ENGINE=InnoDB CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE answer ENGINE=InnoDB CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE archived-answers ENGINE=InnoDB CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE archived-questions ENGINE=InnoDB CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE answer-photos ENGINE=InnoDB CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE Style ENGINE=InnoDB CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE Product-Styles ENGINE=InnoDB CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE Style-Photos ENGINE=InnoDB CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE SKUs ENGINE=InnoDB CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE Review-Results ENGINE=InnoDB CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE Review-Photos ENGINE=InnoDB CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE archived-reviews ENGINE=InnoDB CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE reviews-meta-data ENGINE=InnoDB CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE ratings ENGINE=InnoDB CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE recommended-meta ENGINE=InnoDB CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE characteristics ENGINE=InnoDB CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE size ENGINE=InnoDB CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE width ENGINE=InnoDB CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE comfort ENGINE=InnoDB CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE quality ENGINE=InnoDB CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE fit ENGINE=InnoDB CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE length ENGINE=InnoDB CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO product (id,name,slogan,description,category price) VALUES
-- ('','','','','','');
-- INSERT INTO Product Information (id,Features,value) VALUES
-- ('','','');
-- INSERT INTO   reviews (product_id,id,page,count) VALUES
-- ('','','','');
-- INSERT INTO question (product_id,id,body,date_written,asker_name,question_helpfulness,reported) VALUES
-- ('','','','','','','');
-- INSERT INTO answer (id_question,id,body,date,answerer_name,helpfulness,reported) VALUES
-- ('','','','','','','');
-- INSERT INTO archived-answers (id_answer,id) VALUES
-- ('','');
-- INSERT INTO archived-questions (id_question,id) VALUES
-- ('','');
-- INSERT INTO answer-photos (id_answer,id,photo1,photo2,photo3,photo4,photo5) VALUES
-- ('','','','','','','');
-- INSERT INTO Style (id,id_Product-Styles,name,original_price,sale_price) VALUES
-- ('','','','','','');
-- INSERT INTO Product-Styles (id,product_id) VALUES
-- ('','');
-- INSERT INTO Style-Photos (id,id_Style,thumbnail_url,url) VALUES
-- ('','','','');
-- INSERT INTO SKUs (id,id_Style,quantity,size) VALUES
-- ('','','','');
-- INSERT INTO Review-Results (id_  reviews,id,rating,summary,recommended,response,body,date,reviewer-name,helpfulness) VALUES
-- ('','','','','','','','','','');
-- INSERT INTO Review-Photos (id,id_Review-Results,photo1,photo2,photo3,photo4,photo5) VALUES
-- ('','','','','','','');
-- INSERT INTO archived-reviews (id,id_  reviews) VALUES
-- ('','');
-- INSERT INTO reviews-meta-data (product_id,id) VALUES
-- ('','');
-- INSERT INTO ratings (id,id_reviews-meta-data,1,2,3,4,5) VALUES
-- ('','','','','','','');
-- INSERT INTO recommended-meta (id,id_reviews-meta-data,0,1) VALUES
-- ('','','','');
-- INSERT INTO characteristics (id,id_reviews-meta-data) VALUES
-- ('','');
-- INSERT INTO size (id,id_characteristics,value) VALUES
-- ('','','');
-- INSERT INTO width (id,id_characteristics,value) VALUES
-- ('','','');
-- INSERT INTO comfort (id,id_characteristics,value) VALUES
-- ('','','');
-- INSERT INTO quality (id,value,id_characteristics) VALUES
-- ('','','');
-- INSERT INTO fit (id,id_characteristics,value) VALUES
-- ('','','');
-- INSERT INTO length (id,id_characteristics,value) VALUES
-- ('','','');


-- Table Properties
-- ---

-- ALTER TABLE product ENGINE=InnoDB CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE   reviews ENGINE=InnoDB CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE Review-Photos ENGINE=InnoDB CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE characteristic-rating ENGINE=InnoDB CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE reviews-meta-data ENGINE=InnoDB CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE characteristics ENGINE=InnoDB CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO product (id,name,slogan,description,category price) VALUES
-- ('','','','','','');
-- INSERT INTO   reviews (id,product_id,rating,date,summary,body,recommend,reported,reviewer_name,reviwer_email,response,helfulness) VALUES
-- ('','','','','','','','','','','','');
-- INSERT INTO Review-Photos (id,id_  reviews,url) VALUES
-- ('','','');
-- INSERT INTO characteristic-rating (id,id_characteristics,id_  reviews,value) VALUES
-- ('','','','');
-- INSERT INTO reviews-meta-data (product_id,id) VALUES
-- ('','');
-- INSERT INTO characteristics (id,product_id,id_reviews-meta-data,name) VALUES
-- ('','','','');