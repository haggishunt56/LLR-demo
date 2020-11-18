DROP TABLE IF EXISTS action_details;
DROP TABLE IF EXISTS lesson_details;
DROP TABLE IF EXISTS project_details;
DROP TABLE IF EXISTS portfolio_details;
DROP TABLE IF EXISTS category_details;
DROP TABLE IF EXISTS user_details;

CREATE TABLE portfolio_details (
portfolio_id SERIAL PRIMARY KEY NOT NULL UNIQUE,
portfolio_name VARCHAR(45),
director_name VARCHAR(45),
active BOOL NOT NULL DEFAULT TRUE
);

CREATE TABLE category_details (
category_id SERIAL PRIMARY KEY NOT NULL UNIQUE,
category_name VARCHAR(45)
);

CREATE TABLE project_details (
project_id SERIAL PRIMARY KEY NOT NULL UNIQUE,
project_tp_num VARCHAR(7) NOT NULL UNIQUE,
project_name VARCHAR(100) NOT NULL,
project_type VARCHAR(10) NOT NULL,
start_date DATE NOT NULL,
closure_date DATE,
srm VARCHAR(45) NOT NULL,
status VARCHAR(6) NOT NULL,
portfolio INT NOT NULL,
deleted BOOLEAN NOT NULL DEFAULT FALSE,
CONSTRAINT fk_portfolio
   FOREIGN KEY(portfolio) 
   REFERENCES portfolio_details(portfolio_id)
   ON DELETE CASCADE
);

CREATE TABLE lesson_details (
lesson_id SERIAL PRIMARY KEY NOT NULL UNIQUE,
project_tp_num VARCHAR(7) NOT NULL,
date_added DATE NOT NULL,
category VARCHAR(45) NOT NULL,
www_ebi CHAR(3) NOT NULL,
identified_by VARCHAR(45),
identifiers_area VARCHAR(45),
how_identified VARCHAR(128),
uploaded_by INT NOT NULL,
completion_date DATE,
summary VARCHAR(128),
description TEXT,
recommendations TEXT,
deleted BOOLEAN NOT NULL DEFAULT FALSE,
CONSTRAINT fk_project
   FOREIGN KEY(project_tp_num)
   REFERENCES project_details(project_tp_num)
   ON DELETE CASCADE
);

CREATE TABLE action_details (
action_id SERIAL PRIMARY KEY NOT NULL UNIQUE,
lesson_id INT NOT NULL,
action_details TEXT,
action_owner VARCHAR(45),
target_date DATE,
completed_date DATE,
CONSTRAINT fk_lesson
   FOREIGN KEY(lesson_id)
   REFERENCES lesson_details(lesson_id)
   ON DELETE CASCADE
);

CREATE TABLE user_details (
UserID INT PRIMARY KEY NOT NULL UNIQUE,
UserName VARCHAR(45) NOT NULL,
UserAlias  VARCHAR(45) NOT NULL,
UserActive BOOLEAN NOT NULL DEFAULT FALSE,
UserAdmin BOOLEAN NOT NULL DEFAULT FALSE,
UserImport BOOLEAN NOT NULL DEFAULT FALSE,
UserViewProjects BOOLEAN NOT NULL DEFAULT FALSE,
UserEditProject BOOLEAN NOT NULL DEFAULT FALSE,
UserAddProjects BOOLEAN NOT NULL DEFAULT FALSE,
UserViewLessons BOOLEAN NOT NULL DEFAULT FALSE,
UserEditLessons BOOLEAN NOT NULL DEFAULT FALSE,
UserAddLessons BOOLEAN NOT NULL DEFAULT FALSE,
UserDeleteRecords BOOLEAN NOT NULL DEFAULT FALSE,
UserEditUsers BOOLEAN NOT NULL DEFAULT FALSE,
EditLists BOOLEAN NOT NULL DEFAULT FALSE
);