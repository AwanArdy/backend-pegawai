import { Router } from 'express';
import { getAllDokumen, createDokumen, deleteDokumen } from '../controllers/dokumenController';
import { protect, authorize } from '../middlewares/authMiddleware';
import { upload, processUpload } from '../middlewares/uploadMiddleware';

const router = Router();

router.get('/', protect, getAllDokumen);


router.post('/', protect, authorize('admin'), upload.single('file'), processUpload, createDokumen);
router.delete('/:id', protect, authorize('admin'), deleteDokumen);

export default router;
