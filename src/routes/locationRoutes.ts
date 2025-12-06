import express from 'express';
import { getLocations, createLocation } from '../controllers/locationController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.route('/').get(getLocations).post(createLocation);

export default router;
