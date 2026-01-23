import express from 'express';
import {
    getBorrowers,
    getBorrowerById,
    createBorrower,
    updateBorrower,
    deleteBorrower,
    updateLocationFromOSM,
} from '../controllers/borrowerController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router
    .route('/')
    .get(protect, getBorrowers)
    .post(protect, createBorrower);

router
    .route('/:id/fetch-osm-location')
    .post(protect, updateLocationFromOSM);

router
    .route('/:id')
    .get(protect, getBorrowerById)
    .put(protect, updateBorrower)
    .delete(protect, authorize('ADMIN'), deleteBorrower);

export default router;
