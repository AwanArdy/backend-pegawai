import { Router } from 'express';
import { getAllApprovals, createApproval, processApproval } from '../controllers/approvalController';
import { protect, authorize } from '../middlewares/authMiddleware';
import { upload, processUpload } from '../middlewares/uploadMiddleware';

const router = Router();

router.get('/', protect, getAllApprovals);
router.post('/', protect, upload.single('dokumen'), processUpload, createApproval);
router.put('/:id', protect, authorize('admin', 'pimpinan'), processApproval);

export default router;
