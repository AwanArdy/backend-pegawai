'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('pegawai', 'tanggal_masuk', {
      type: Sequelize.DATEONLY,
      allowNull: true,
      after: 'tmt_kgb'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('pegawai', 'tanggal_masuk');
  }
};
