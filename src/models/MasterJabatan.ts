import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class MasterJabatan extends Model {
  declare id: number;
  declare nama: string;
  declare tipe: 'Struktural' | 'Fungsional' | 'Pelaksana';
  declare eselon?: string;
}


MasterJabatan.init(
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
    tipe: {
      type: DataTypes.ENUM('Struktural', 'Fungsional', 'Pelaksana'),
      allowNull: false,
    },
    eselon: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'master_jabatan',
    timestamps: false,
  }
);

export default MasterJabatan;
