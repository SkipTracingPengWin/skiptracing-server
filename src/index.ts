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
import recoveryActionRoutes from './routes/recoveryActionRoutes';
import socialMediaRoutes from './routes/socialMediaRoutes';
import activityFeedRoutes from './routes/activityFeed.route';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://192.168.31.16:3000",
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/borrowers', borrowerRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/activity-feed', activityFeedRoutes);
app.use('/api/verifications', verificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/recovery-trends', recoveryTrendRoutes);
app.use("/api/recovery-actions", recoveryActionRoutes);
app.use("/api/social-media", socialMediaRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});