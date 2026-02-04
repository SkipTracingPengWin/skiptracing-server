import express from 'express';
import { searchProfiles, getSocialMediaByAgent } from '../controllers/socialMediaController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// Search for social media profiles
router.post('/search', searchProfiles);

// Get social media profiles for borrowers assigned to an agent
router.get('/agent/:agentId', protect, authorize('ADMIN', 'MANAGER', 'AGENT'), getSocialMediaByAgent);

export default router;
