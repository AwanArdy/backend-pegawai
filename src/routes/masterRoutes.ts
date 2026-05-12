import { Router } from 'express';
import {
    getAllGolongan, createGolongan, updateGolongan, deleteGolongan,
    getAllJabatan, createJabatan, updateJabatan, deleteJabatan,
    getAllUnitKerja, createUnitKerja, updateUnitKerja, deleteUnitKerja
} from '../controllers/masterController';
import { protect, authorize } from '../middlewares/authMiddleware';

const router = Router();

// Golongan
router.get('/golongan', protect, getAllGolongan);
router.post('/golongan', protect, authorize('admin'), createGolongan);
router.put('/golongan/:id', protect, authorize('admin'), updateGolongan);
router.delete('/golongan/:id', protect, authorize('admin'), deleteGolongan);

// Jabatan
router.get('/jabatan', protect, getAllJabatan);
router.post('/jabatan', protect, authorize('admin'), createJabatan);
router.put('/jabatan/:id', protect, authorize('admin'), updateJabatan);
router.delete('/jabatan/:id', protect, authorize('admin'), deleteJabatan);

// Unit Kerja
router.get('/unit-kerja', protect, getAllUnitKerja);
router.post('/unit-kerja', protect, authorize('admin'), createUnitKerja);
router.put('/unit-kerja/:id', protect, authorize('admin'), updateUnitKerja);
router.delete('/unit-kerja/:id', protect, authorize('admin'), deleteUnitKerja);

export default router;
