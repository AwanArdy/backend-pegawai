import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class MasterUnitKerja extends Model {
  declare id: number;
  declare nama: string;
  declare kode: string;
  declare lokasi?: string;
}


MasterUnitKerja.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    kode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    lokasi: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'master_unit_kerja',
    timestamps: false,
  }
);

export default MasterUnitKerja;
