import express from 'express';
import {
    getAssignments,
    getAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment,
} from '../controllers/assignmentController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router
    .route('/')
    .get(protect, getAssignments)
    .post(protect, authorize('ADMIN', 'MANAGER'), createAssignment);

router
    .route('/:id')
    .get(protect, getAssignmentById)
    .put(protect, updateAssignment)
    .delete(protect, authorize('ADMIN', 'MANAGER'), deleteAssignment);

export default router;
