'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('pegawai', [
      {
        nip: 'admin',
        nama: 'Demo Admin User',
        jabatan_id: 1, 
        golongan_id: 13, 
        unit_kerja_id: 2, 
        email: 'admin@demo.local',
        phone: '08111111111',
        tmt_pangkat: '2020-01-01',
        tmt_kgb: '2022-01-01',
        tanggal_masuk: '2010-01-01',
        status: 'aktif'
      },
      {
        nip: 'pegawai',
        nama: 'Demo Pegawai User',
        jabatan_id: 3, 
        golongan_id: 9, 
        unit_kerja_id: 4, 
        email: 'pegawai@demo.local',
        phone: '08123456789',
        tmt_pangkat: '2022-01-01',
        tmt_kgb: '2023-06-01',
        tanggal_masuk: '2015-01-01',
        status: 'aktif'
      },
      {
        nip: '198501012010011001',
        nama: 'Ir. Ahmad Subagja, M.Si',
        jabatan_id: 1, 
        golongan_id: 14, 
        unit_kerja_id: 2, 
        email: 'ahmad.subagja@sikapas.local',
        phone: '081234567890',
        tmt_pangkat: '2022-04-01',
        tmt_kgb: '2023-01-01',
        tanggal_masuk: '2010-01-01',
        status: 'aktif'
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('pegawai', { nip: ['admin', 'pegawai', '198501012010011001'] }, {});
  }
};
