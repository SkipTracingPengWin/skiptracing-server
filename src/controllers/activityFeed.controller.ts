import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// @desc    Get activity feed (Audit Logs)
// @route   GET /api/activity-feed
// @access  Private/Admin
export const getActivityFeed = async (req: Request, res: Response) => {
    try {
        const logs = await prisma.auditLog.findMany({
            orderBy: {
                timestamp: 'desc',
            },
            take: 50, // Limit to latest 50 for now
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                    },
                },
                borrower: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            },
        });

        const formattedLogs = logs.map(log => ({
            ...log,
            actor: log.user ? {
                type: 'USER',
                name: log.user.name,
                role: log.user.role,
                id: log.user.id
            } : {
                type: 'SYSTEM',
                name: 'SYSTEM',
                role: 'SYSTEM',
                id: 'SYSTEM'
            }
        }));

        res.status(200).json({
            success: true,
            count: formattedLogs.length,
            data: formattedLogs,
        });
    } catch (error) {
        console.error('Error fetching activity feed:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};
