import express from 'express';
import { getDashboardStats, updateDashboardStats } from '../controllers/dashboardController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.route('/').get(getDashboardStats).put(authorize('ADMIN'), updateDashboardStats);

export default router;
