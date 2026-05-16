import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Pegawai from './Pegawai';

class Riwayat extends Model {
  declare id: number;
  declare pegawai_id: number;
  declare type: 'pangkat' | 'kgb' | 'dokumen' | 'approval';
  declare title: string;
  declare description?: string;
  declare date: Date;
  declare status?: 'pending' | 'approved' | 'rejected';
}


Riwayat.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pegawai_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Pegawai,
        key: 'id'
      }
    },
    type: {
      type: DataTypes.ENUM('pangkat', 'kgb', 'dokumen', 'approval'),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'riwayat',
    timestamps: false,
  }
);


export default Riwayat;
