import express from 'express';
import {
    getAgents,
    getAgentById,
    createAgent,
    updateAgent,
    deleteAgent,
} from '../controllers/agentController';
import { protect, authorize } from '../middleware/authMiddleware';
import { Agent } from 'http';

const router = express.Router();

router
    .route('/')
    .get(protect, authorize('ADMIN', 'MANAGER', 'AGENT'), getAgents)
    .post(protect, authorize('ADMIN', 'MANAGER'), createAgent);

router
    .route('/:id')
    .get(protect, getAgentById)
    .put(protect, authorize('ADMIN', 'MANAGER'), updateAgent)
    .delete(protect, authorize('ADMIN'), deleteAgent);

export default router;
