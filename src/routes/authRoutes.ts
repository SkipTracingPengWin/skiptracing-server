import express from 'express';
import { registerUser, loginUser, profile, changePassword, updateProfile } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, profile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

export default router;
