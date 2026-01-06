import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateAuditLogParams {
    actorId?: string; // ID of the user or agent performing the action
    borrowerId?: string; // ID of the borrower related to the action
    module: 'BORROWER' | 'AGENT' | 'ASSIGNMENT' | 'VERIFICATION' | 'SOCIAL_MEDIA' | 'RECOVERY';
    action: string; // e.g., 'CREATE', 'UPDATE', 'DELETE', 'STATUS_CHANGE'
    details?: string; // Description of the change
    status?: 'SUCCESS' | 'FAILED';
}

export const auditLogService = {
    /**
     * Create a new audit log entry.
     * This is a write-only operation.
     */
    createLog: async (params: CreateAuditLogParams) => {
        try {
            const isSystem = params.actorId === 'SYSTEM';
            const actorId = isSystem ? null : params.actorId;
            const details = isSystem ? `[SYSTEM] ${params.details}` : (params.details || '');

            await prisma.auditLog.create({
                data: {
                    actorId,
                    borrowerId: params.borrowerId,
                    module: params.module,
                    action: params.action,
                    details,
                    status: params.status || 'SUCCESS',
                    // timestamp is handled by @default(now()) in schema
                },
            });
        } catch (error) {
            console.error('Failed to create audit log:', error);
            // We generally don't want to fail the main operation if logging fails,
            // but in a strict compliance system, might want to re-throw.
            // For now, logging the error is sufficient.
        }
    },
};
