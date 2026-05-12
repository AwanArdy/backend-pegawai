import { Router } from 'express';
import { getStats, getDistribution, getTrends } from '../controllers/dashboardController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.get('/stats', protect, getStats);
router.get('/distribution', protect, getDistribution);
router.get('/trends', protect, getTrends);

export default router;
