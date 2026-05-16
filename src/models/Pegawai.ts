import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import MasterJabatan from './MasterJabatan';
import MasterGolongan from './MasterGolongan';
import MasterUnitKerja from './MasterUnitKerja';
import User from './User';
import Riwayat from './Riwayat';


class Pegawai extends Model {
  declare id: number;
  declare nip: string;
  declare nama: string;
  declare jabatan_id: number;
  declare golongan_id: number;
  declare unit_kerja_id: number;
  declare email?: string;
  declare phone?: string;
  declare tmt_pangkat?: string;
  declare tmt_kgb?: string;
  declare tanggal_masuk?: string;
  declare status: 'aktif' | 'cuti' | 'pensiun';
  declare avatar?: string;

  // Virtual/Associated
  declare jabatan?: MasterJabatan;
  declare golongan?: MasterGolongan;
  declare unit_kerja?: MasterUnitKerja;
  declare user?: User;
  declare riwayats?: Riwayat[];
}


Pegawai.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nip: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    nama: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    jabatan_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: MasterJabatan,
        key: 'id',
      },
    },
    golongan_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: MasterGolongan,
        key: 'id',
      },
    },
    unit_kerja_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: MasterUnitKerja,
        key: 'id',
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    tmt_pangkat: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    tmt_kgb: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    tanggal_masuk: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('aktif', 'cuti', 'pensiun'),
      defaultValue: 'aktif',
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'pegawai',
    timestamps: false,
  }
);

// Associations
Pegawai.belongsTo(MasterJabatan, { foreignKey: 'jabatan_id', as: 'jabatan' });
Pegawai.belongsTo(MasterGolongan, { foreignKey: 'golongan_id', as: 'golongan' });
Pegawai.belongsTo(MasterUnitKerja, { foreignKey: 'unit_kerja_id', as: 'unit_kerja' });
Pegawai.hasOne(User, { foreignKey: 'nip', sourceKey: 'nip', as: 'user', onDelete: 'CASCADE' });
Pegawai.hasMany(Riwayat, { foreignKey: 'pegawai_id', as: 'riwayats', onDelete: 'CASCADE' });

User.belongsTo(Pegawai, { foreignKey: 'nip', targetKey: 'nip', as: 'pegawai' });


export default Pegawai;
