import express from 'express';
import {
    getAlerts,
    markAlertAsRead,
    createAlert,
    deleteAlert,
} from '../controllers/alertController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.route('/').get(getAlerts).post(createAlert);
router.route('/:id').put(markAlertAsRead).delete(deleteAlert);

export default router;
