'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. master_golongan
    await queryInterface.createTable('master_golongan', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      kode: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true,
      },
      nama: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      ruang: {
        type: Sequelize.STRING(5),
        allowNull: false,
      },
    });

    // 2. master_jabatan
    await queryInterface.createTable('master_jabatan', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nama: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      tipe: {
        type: Sequelize.ENUM('Struktural', 'Fungsional', 'Pelaksana'),
        allowNull: false,
      },
      eselon: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
    });

    // 3. master_unit_kerja
    await queryInterface.createTable('master_unit_kerja', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nama: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      kode: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      lokasi: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
    });

    // 4. pegawai
    await queryInterface.createTable('pegawai', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nip: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      nama: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      jabatan_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'master_jabatan',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      golongan_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'master_golongan',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      unit_kerja_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'master_unit_kerja',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      tmt_pangkat: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      tmt_kgb: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('aktif', 'cuti', 'pensiun'),
        defaultValue: 'aktif',
      },
      avatar: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
    });

    // 5. users
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      nip: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
        references: {
          model: 'pegawai',
          key: 'nip',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('admin', 'pegawai', 'pimpinan'),
        allowNull: false,
      },
      jabatan: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      avatar: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // 6. approvals
    await queryInterface.createTable('approvals', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      pegawai_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'pegawai',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      type: {
        type: Sequelize.ENUM('Kenaikan Pangkat', 'KGB', 'Cuti', 'Mutasi', 'Lainnya'),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
      },
      dokumen_url: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      catatan: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      submitted_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // 7. riwayat
    await queryInterface.createTable('riwayat', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      pegawai_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'pegawai',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      type: {
        type: Sequelize.ENUM('pangkat', 'kgb', 'dokumen', 'approval'),
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        allowNull: true,
      },
    });

    // 8. dokumen_penting
    await queryInterface.createTable('dokumen_penting', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      size: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      file_url: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('dokumen_penting');
    await queryInterface.dropTable('riwayat');
    await queryInterface.dropTable('approvals');
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('pegawai');
    await queryInterface.dropTable('master_unit_kerja');
    await queryInterface.dropTable('master_jabatan');
    await queryInterface.dropTable('master_golongan');
  }
};
