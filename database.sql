CREATE DATABASE purplehat;

CREATE TABLE info(
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(50),
    phone VARCHAR(20)

);

CREATE TABLE admin(
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    password VARCHAR(100)
);

CREATE TABLE count(
    id int,
    hatcount VARCHAR(50)
    
);

