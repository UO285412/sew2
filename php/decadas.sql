-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS `decadas`;
USE `decadas`;

-- Crear la tabla '50s'
CREATE TABLE IF NOT EXISTS `50s` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `Nombre` VARCHAR(30) NOT NULL,
    `Nacionalidad` VARCHAR(10) NOT NULL,
    `Escuderia` VARCHAR(30) NOT NULL
) ENGINE=InnoDB;

-- Crear la tabla '60s'
CREATE TABLE IF NOT EXISTS `60s` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `Nombre` VARCHAR(30) NOT NULL,
    `Nacionalidad` VARCHAR(10) NOT NULL,
    `Escuderia` VARCHAR(30) NOT NULL
) ENGINE=InnoDB;

-- Crear la tabla '70s'
CREATE TABLE IF NOT EXISTS `70s` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `Nombre` VARCHAR(30) NOT NULL,
    `Nacionalidad` VARCHAR(10) NOT NULL,
    `Escuderia` VARCHAR(30) NOT NULL
) ENGINE=InnoDB;

-- Crear la tabla '80s'
CREATE TABLE IF NOT EXISTS `80s` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `Nombre` VARCHAR(30) NOT NULL,
    `Nacionalidad` VARCHAR(10) NOT NULL,
    `Escuderia` VARCHAR(30) NOT NULL
) ENGINE=InnoDB;

-- Crear la tabla '90s'
CREATE TABLE IF NOT EXISTS `90s` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `Nombre` VARCHAR(30) NOT NULL,
    `Nacionalidad` VARCHAR(10) NOT NULL,
    `Escuderia` VARCHAR(30) NOT NULL
) ENGINE=InnoDB;

-- Crear la tabla '2000s'
CREATE TABLE IF NOT EXISTS `2000s` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `Nombre` VARCHAR(30) NOT NULL,
    `Nacionalidad` VARCHAR(10) NOT NULL,
    `Escuderia` VARCHAR(30) NOT NULL
) ENGINE=InnoDB;

-- Crear la tabla '2010s'
CREATE TABLE IF NOT EXISTS `2010s` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `Nombre` VARCHAR(30) NOT NULL,
    `Nacionalidad` VARCHAR(10) NOT NULL,
    `Escuderia` VARCHAR(30) NOT NULL
) ENGINE=InnoDB;
