import express from 'express';
import {
    getVerifications,
    createVerification,
    updateVerification,
    deleteVerification,
} from '../controllers/verificationController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.route('/').get(getVerifications).post(createVerification);
router
    .route('/:id')
    .put(updateVerification)
    .delete(authorize('ADMIN'), deleteVerification);

export default router;
