import { Request, Response } from 'express';
import Approval from '../models/Approval';
import Pegawai from '../models/Pegawai';
import Riwayat from '../models/Riwayat';
import sequelize from '../config/database';
import fs from 'fs';

export const getAllApprovals = async (req: any, res: Response) => {
    try {
        const { status, type } = req.query;
        const whereClause: any = {};
        
        if (status) whereClause.status = status;
        if (type) whereClause.type = type;

        // If user is pegawai, only show their own approvals
        if (req.user.role === 'pegawai') {
            const pegawai = await Pegawai.findOne({ where: { nip: req.user.nip } });
            if (pegawai) {
                whereClause.pegawai_id = pegawai.id;
            } else {
                return res.json({ success: true, data: [] });
            }
        }

        const data = await Approval.findAll({
            where: whereClause,
            include: [{ model: Pegawai, as: 'pegawai' }],
            order: [['submitted_at', 'DESC']]
        });

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createApproval = async (req: any, res: Response) => {
    try {
        let { pegawai_id, type } = req.body;
        const dokumen_url = req.file?.path;

        // If user is pegawai, always use their own pegawai record
        if (req.user.role === 'pegawai') {
            const pegawai = await Pegawai.findOne({ where: { nip: req.user.nip } });
            if (!pegawai) {
                return res.status(404).json({ success: false, message: 'Pegawai data not found' });
            }
            pegawai_id = pegawai.id;
        }

        if (!pegawai_id) {
            return res.status(400).json({ success: false, message: 'pegawai_id is required' });
        }

        const data = await Approval.create({
            pegawai_id,
            type: type || 'Lainnya',
            dokumen_url,
            status: 'pending'
        });

        // Save file to disk only after DB success
        if (req.file) {
            fs.writeFileSync(req.file.fullPath, req.file.buffer);
        }

        res.status(201).json({ success: true, data });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const processApproval = async (req: Request, res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { status, catatan, new_golongan_id, new_date } = req.body;

        const approval = await Approval.findByPk(id as string);
        if (!approval) {
            return res.status(404).json({ success: false, message: 'Approval record not found' });
        }

        if (approval.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Approval already processed' });
        }

        approval.status = status;
        approval.catatan = catatan;
        await approval.save({ transaction });

        if (status === 'approved') {
            const pegawai = await Pegawai.findByPk(approval.pegawai_id);
            if (pegawai) {
                // Logic based on type
                if (approval.type === 'Kenaikan Pangkat') {
                    if (new_golongan_id) pegawai.golongan_id = new_golongan_id;
                    if (new_date) pegawai.tmt_pangkat = new_date;
                } else if (approval.type === 'KGB') {
                    if (new_date) pegawai.tmt_kgb = new_date;
                }
                
                await pegawai.save({ transaction });

                // Create Riwayat
                await Riwayat.create({
                    pegawai_id: pegawai.id,
                    type: approval.type === 'Kenaikan Pangkat' ? 'pangkat' : 
                          approval.type === 'KGB' ? 'kgb' : 'approval',
                    title: `${approval.type} Disetujui`,
                    description: catatan || `Pengajuan ${approval.type} telah disetujui.`,
                    date: new Date(),
                    status: 'approved'
                }, { transaction });
            }
        } else if (status === 'rejected') {
             await Riwayat.create({
                    pegawai_id: approval.pegawai_id,
                    type: 'approval',
                    title: `${approval.type} Ditolak`,
                    description: catatan || `Pengajuan ${approval.type} ditolak.`,
                    date: new Date(),
                    status: 'rejected'
                }, { transaction });
        }

        await transaction.commit();
        res.json({ success: true, data: approval });
    } catch (error: any) {
        await transaction.rollback();
        res.status(500).json({ success: false, message: error.message });
    }
};
