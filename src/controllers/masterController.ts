import { Request, Response } from 'express';
import MasterGolongan from '../models/MasterGolongan';
import MasterJabatan from '../models/MasterJabatan';
import MasterUnitKerja from '../models/MasterUnitKerja';

// --- GOLONGAN ---
export const getAllGolongan = async (req: Request, res: Response) => {
    try {
        const data = await MasterGolongan.findAll();
        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createGolongan = async (req: Request, res: Response) => {
    try {
        const data = await MasterGolongan.create(req.body);
        res.status(201).json({ success: true, data });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateGolongan = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [updated] = await MasterGolongan.update(req.body, { where: { id } });
        if (updated) {
            const updatedData = await MasterGolongan.findByPk(id as string);
            return res.json({ success: true, data: updatedData });
        }
        res.status(404).json({ success: false, message: 'Data not found' });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteGolongan = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await MasterGolongan.destroy({ where: { id } });
        if (deleted) {
            return res.json({ success: true, message: 'Data deleted' });
        }
        res.status(404).json({ success: false, message: 'Data not found' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- JABATAN ---
export const getAllJabatan = async (req: Request, res: Response) => {
    try {
        const data = await MasterJabatan.findAll();
        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createJabatan = async (req: Request, res: Response) => {
    try {
        const data = await MasterJabatan.create(req.body);
        res.status(201).json({ success: true, data });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateJabatan = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [updated] = await MasterJabatan.update(req.body, { where: { id } });
        if (updated) {
            const updatedData = await MasterJabatan.findByPk(id as string);
            return res.json({ success: true, data: updatedData });
        }
        res.status(404).json({ success: false, message: 'Data not found' });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteJabatan = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await MasterJabatan.destroy({ where: { id } });
        if (deleted) {
            return res.json({ success: true, message: 'Data deleted' });
        }
        res.status(404).json({ success: false, message: 'Data not found' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- UNIT KERJA ---
export const getAllUnitKerja = async (req: Request, res: Response) => {
    try {
        const data = await MasterUnitKerja.findAll();
        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createUnitKerja = async (req: Request, res: Response) => {
    try {
        const data = await MasterUnitKerja.create(req.body);
        res.status(201).json({ success: true, data });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateUnitKerja = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [updated] = await MasterUnitKerja.update(req.body, { where: { id } });
        if (updated) {
            const updatedData = await MasterUnitKerja.findByPk(id as string);
            return res.json({ success: true, data: updatedData });
        }
        res.status(404).json({ success: false, message: 'Data not found' });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteUnitKerja = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await MasterUnitKerja.destroy({ where: { id } });
        if (deleted) {
            return res.json({ success: true, message: 'Data deleted' });
        }
        res.status(404).json({ success: false, message: 'Data not found' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
