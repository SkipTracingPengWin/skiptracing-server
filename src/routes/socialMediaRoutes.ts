import express from 'express';
import { searchProfiles } from '../controllers/socialMediaController';
// In a real scenario, you'd likely import 'protect' middleware here.
// import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Define route
// If auth is required, add middleware: router.post('/search', protect, searchProfiles);
router.post('/search', searchProfiles);

export default router;
