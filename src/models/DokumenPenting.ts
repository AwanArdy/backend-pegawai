import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class DokumenPenting extends Model {
  declare id: number;
  declare name: string;
  declare type: string;
  declare size: string;
  declare file_url: string;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}


DokumenPenting.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    size: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    file_url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'dokumen_penting',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default DokumenPenting;
