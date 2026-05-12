import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class User extends Model {
  declare id: number;
  declare name: string;
  declare nip: string;
  declare email: string;
  declare password: string;
  declare role: 'admin' | 'pegawai' | 'pimpinan';
  declare jabatan?: string;
  declare avatar?: string;
  declare readonly created_at: Date;
}


User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    nip: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'pegawai', 'pimpinan'),
      allowNull: false,
    },
    jabatan: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);

export default User;
