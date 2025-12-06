import express from 'express';
import { getAuditLogs, createAuditLog } from '../controllers/auditLogController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.route('/').get(authorize('ADMIN', 'MANAGER'), getAuditLogs).post(createAuditLog);

export default router;
