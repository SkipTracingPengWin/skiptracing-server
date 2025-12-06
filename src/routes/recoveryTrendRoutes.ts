import express from 'express';
import { getRecoveryTrends, createRecoveryTrend } from '../controllers/recoveryTrendController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.route('/').get(getRecoveryTrends).post(authorize('ADMIN'), createRecoveryTrend);

export default router;
