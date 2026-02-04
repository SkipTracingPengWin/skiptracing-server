import express from 'express';
import {
    getAssignments,
    getAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    getAssignmentsByAgentId,
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

router
    .route('/agent/:agentId')
    .get(protect, authorize('ADMIN', 'MANAGER', 'AGENT'), getAssignmentsByAgentId);

export default router;
