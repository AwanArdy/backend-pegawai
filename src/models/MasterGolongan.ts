import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class MasterGolongan extends Model {
  declare id: number;
  declare kode: string;
  declare nama: string;
  declare ruang: string;
}


MasterGolongan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    kode: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    nama: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    ruang: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'master_golongan',
    timestamps: false,
  }
);

export default MasterGolongan;
