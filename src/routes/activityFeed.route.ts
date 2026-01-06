import express from 'express';
import { getActivityFeed } from '../controllers/activityFeed.controller';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getActivityFeed);

export default router;
