CREATE DATABASE IF NOT EXISTS simpeg_db;
USE simpeg_db;

-- Tabel users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    nip VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'pegawai', 'pimpinan') NOT NULL,
    jabatan VARCHAR(100),
    avatar VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabel pegawai
CREATE TABLE IF NOT EXISTS pegawai (
    id VARCHAR(50) PRIMARY KEY,
    nip VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(100) NOT NULL,
    jabatan VARCHAR(100),
    golongan VARCHAR(10),
    unitKerja VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    tmtPangkat DATE,
    tmtKgb DATE,
    status ENUM('aktif', 'cuti', 'pensiun') DEFAULT 'aktif',
    avatar VARCHAR(255)
) ENGINE=InnoDB;

-- Tabel approvals
CREATE TABLE IF NOT EXISTS approvals (
    id VARCHAR(50) PRIMARY KEY,
    pegawaiId VARCHAR(50),
    type ENUM('Kenaikan Pangkat', 'KGB', 'Cuti', 'Mutasi') NOT NULL,
    submittedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    dokumen VARCHAR(255),
    catatan TEXT,
    FOREIGN KEY (pegawaiId) REFERENCES pegawai(id) ON DELETE CASCADE
) ENGINE=InnoDB;
