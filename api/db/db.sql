CREATE DATABASE testecontele; 

\c testecontele

CREATE TABLE IF NOT EXISTS usuario(
    id SERIAL PRIMARY KEY UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NULL 
);

SELECT * FROM usuario;