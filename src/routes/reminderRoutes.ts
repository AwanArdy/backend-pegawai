import { Router } from 'express';
import { getReminders } from '../controllers/reminderController';
import { protect, authorize } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', protect, authorize('admin', 'pimpinan'), getReminders);

export default router;
