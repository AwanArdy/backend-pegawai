import { Request, Response } from 'express';
import Pegawai from '../models/Pegawai';
import { transformPegawai } from './pegawaiController';

// Helper to calculate next dates (reusing logic from frontend)
const calculateNextDate = (baseDate: string | null | undefined, cycleYears: number) => {
    if (!baseDate) return new Date();
    const start = new Date(baseDate);
    const now = new Date();
    const next = new Date(start);

    while (next <= now) {
        next.setFullYear(next.getFullYear() + cycleYears);
    }
    return next;
};

const daysUntil = (date: Date) => {
    const d = date.getTime() - Date.now();
    return Math.ceil(d / (1000 * 60 * 60 * 24));
};

export const getReminders = async (req: Request, res: Response) => {
    try {
        const pegawai = await Pegawai.findAll({
            include: ['golongan', 'jabatan', 'unit_kerja']
        });

        const reminders: any[] = [];

        pegawai.forEach((p: any) => {
            const nextP = calculateNextDate(p.tmt_pangkat || p.tanggal_masuk, 4);
            const nextK = calculateNextDate(p.tmt_kgb || p.tanggal_masuk, 2);

            reminders.push({
                id: `${p.id}-pangkat`,
                pegawai: transformPegawai(p),
                type: 'pangkat',
                date: nextP.toISOString(),
                days: daysUntil(nextP)
            });

            reminders.push({
                id: `${p.id}-kgb`,
                pegawai: transformPegawai(p),
                type: 'kgb',
                date: nextK.toISOString(),
                days: daysUntil(nextK)
            });
        });

        // Sort by days
        reminders.sort((a, b) => a.days - b.days);

        res.json({ success: true, data: reminders });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
