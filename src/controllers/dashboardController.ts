import { Request, Response } from 'express';
import { Op, fn, col, literal } from 'sequelize';
import Pegawai from '../models/Pegawai';
import MasterGolongan from '../models/MasterGolongan';
import Approval from '../models/Approval';

export const getStats = async (req: Request, res: Response) => {
    try {
        const totalPegawai = await Pegawai.count();
        const pendingApprovals = await Approval.count({ where: { status: 'pending' } });
        
        const now = new Date().toISOString().split('T')[0];
        const threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
        const limitDate = threeMonthsFromNow.toISOString().split('T')[0];
        
        // Upcoming Pangkat (Next 3 months, recurring every 4 years from entry)
        // Formula: (48 - MOD(TIMESTAMPDIFF(MONTH, entry, now), 48)) % 48 <= 3
        const upcomingPangkat = await Pegawai.count({
            where: literal(`tanggal_masuk IS NOT NULL AND (48 - (MOD(TIMESTAMPDIFF(MONTH, tanggal_masuk, CURDATE()), 48))) % 48 <= 3`)
        });

        // Upcoming KGB (Next 3 months, recurring every 2 years from entry)
        // Formula: (24 - MOD(TIMESTAMPDIFF(MONTH, entry, now), 24)) % 24 <= 3
        const upcomingKGB = await Pegawai.count({
            where: literal(`tanggal_masuk IS NOT NULL AND (24 - (MOD(TIMESTAMPDIFF(MONTH, tanggal_masuk, CURDATE()), 24))) % 24 <= 3`)
        });

        res.json({
            success: true,
            data: {
                totalPegawai,
                pendingApprovals,
                upcomingPangkat,
                upcomingKGB
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getDistribution = async (req: Request, res: Response) => {
    try {
        const distribution = await Pegawai.findAll({
            attributes: [
                [col('golongan.kode'), 'golongan_kode'],
                [fn('COUNT', col('Pegawai.id')), 'count']
            ],
            include: [{
                model: MasterGolongan,
                as: 'golongan',
                attributes: []
            }],
            group: ['golongan.kode'],
            raw: true
        });

        res.json({ success: true, data: distribution });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getTrends = async (req: Request, res: Response) => {
    try {
        // Trend 6 months back
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const pangkatTrend = await Pegawai.findAll({
            attributes: [
                [fn('DATE_FORMAT', col('tmt_pangkat'), '%Y-%m'), 'month'],
                [fn('COUNT', col('id')), 'count']
            ],
            where: {
                tmt_pangkat: {
                    [Op.gte]: sixMonthsAgo
                }
            },
            group: [fn('DATE_FORMAT', col('tmt_pangkat'), '%Y-%m')],
            order: [[fn('DATE_FORMAT', col('tmt_pangkat'), '%Y-%m'), 'ASC']],
            raw: true
        });

        const kgbTrend = await Pegawai.findAll({
            attributes: [
                [fn('DATE_FORMAT', col('tmt_kgb'), '%Y-%m'), 'month'],
                [fn('COUNT', col('id')), 'count']
            ],
            where: {
                tmt_kgb: {
                    [Op.gte]: sixMonthsAgo
                }
            },
            group: [fn('DATE_FORMAT', col('tmt_kgb'), '%Y-%m')],
            order: [[fn('DATE_FORMAT', col('tmt_kgb'), '%Y-%m'), 'ASC']],
            raw: true
        });

        res.json({
            success: true,
            data: {
                pangkat: pangkatTrend,
                kgb: kgbTrend
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
