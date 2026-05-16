import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Pegawai from './Pegawai';

class Approval extends Model {
  declare id: number;
  declare pegawai_id: number;
  declare type: 'Kenaikan Pangkat' | 'KGB' | 'Cuti' | 'Mutasi' | 'Lainnya';
  declare submitted_at: Date;
  declare status: 'pending' | 'approved' | 'rejected';
  declare dokumen_url?: string;
  declare catatan?: string;
}


Approval.init(
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
        key: 'id',
      },
    },
    type: {
      type: DataTypes.ENUM('Kenaikan Pangkat', 'KGB', 'Cuti', 'Mutasi', 'Lainnya'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
    },
    dokumen_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    catatan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'approvals',
    timestamps: true,
    createdAt: 'submitted_at',
    updatedAt: false,
  }
);

Approval.belongsTo(Pegawai, { foreignKey: 'pegawai_id', as: 'pegawai' });
Pegawai.hasMany(Approval, { foreignKey: 'pegawai_id', as: 'approvals', onDelete: 'CASCADE' });

export default Approval;
