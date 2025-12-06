/// <reference path="./types/express.d.ts" />
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import agentRoutes from './routes/agentRoutes';
import borrowerRoutes from './routes/borrowerRoutes';
import assignmentRoutes from './routes/assignmentRoutes';
import alertRoutes from './routes/alertRoutes';
import auditLogRoutes from './routes/auditLogRoutes';
import verificationRoutes from './routes/verificationRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import locationRoutes from './routes/locationRoutes';
import recoveryTrendRoutes from './routes/recoveryTrendRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/borrowers', borrowerRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/verifications', verificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/recovery-trends', recoveryTrendRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});