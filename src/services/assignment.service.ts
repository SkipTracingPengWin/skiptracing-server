import { prisma } from "../config/database";
import { AssignmentStatus, Prisma } from "@prisma/client";
import { auditLogService } from "./auditLogService";

export const getAssignmentsService = () => {
  return prisma.assignment.findMany({
    include: {
      borrower: true,
      agent: {
        include: {
          user: {
            select: { name: true },
          },
        },
      },
    },
  });
};

export const getAssignmentByIdService = (id: string) => {
  return prisma.assignment.findUnique({
    where: { id },
    include: {
      borrower: true,
      agent: {
        include: {
          user: {
            select: { name: true },
          },
        },
      },
    },
  });
};

// Helper function to update agent stats
const updateAgentStats = async (
  agentId: string,
  tx: Prisma.TransactionClient
) => {
  // Use 'any' cast to avoid strict type mismatch with PrismaClient vs TransactionClient
  const client = tx as any;

  const assignments = await client.assignment.findMany({
    where: { agentId },
    include: { borrower: true },
  });

  const totalCases = assignments.length;
  // Ensure we match the Enum value strictly
  const closedCases = assignments.filter(
    (a: any) => a.status === AssignmentStatus.CLOSED
  );

  const successRate =
    totalCases > 0 ? (closedCases.length / totalCases) * 100 : 0;

  const totalRecovered = closedCases.reduce((sum: number, a: any) => {
    // Fallback to amount if amountNumeric is 0 or missing.
    // Both are Floats in schema, so we can use them directly.
    const amt = a.borrower?.amountNumeric || a.borrower?.amount || 0;
    return sum + amt;
  }, 0);

  await client.agent.update({
    where: { id: agentId },
    data: {
      cases: totalCases,
      successRate,
      totalRecovered,
    },
  });
};

export const createAssignmentService = async (data: any, user?: any) => {
  const assignment = await prisma.$transaction(async (tx) => {
    // 1. Create Assignment
    const assignment = await tx.assignment.create({
      data: {
        ...data,
        status: AssignmentStatus.OPEN,
      },
    });

    // 2. Update stats
    if (data.agentId) {
      await updateAgentStats(data.agentId, tx);
    }

    return assignment;
  });

  const actorId = user ? user.id : "SYSTEM";
  const actorName = user ? user.name : "SYSTEM";
  const actorRole = user ? user.role : undefined;

  await auditLogService.createLog({
    borrowerId: assignment.borrowerId,
    module: "ASSIGNMENT",
    action: "CREATE",
    details: `Assignment created for agent ${data.agentId || 'Unassigned'}`,
    status: "SUCCESS",
    actorId,
    actorName,
    actorRole,
  });

  return assignment;
};

export const updateAssignmentService = async (id: string, data: any, user?: any) => {
  const updatedAssignment = await prisma.$transaction(async (tx) => {
    // 1. Get original to check for agent reassignment
    const originalAssignment = await tx.assignment.findUnique({
      where: { id },
    });

    const result = await tx.assignment.update({
      where: { id },
      data,
    });

    // 2. Update stats for new agent
    if (result.agentId) {
      await updateAgentStats(result.agentId, tx);
    }

    // 3. Update stats for OLD agent if changed
    if (
      originalAssignment?.agentId &&
      originalAssignment.agentId !== result.agentId
    ) {
      await updateAgentStats(originalAssignment.agentId, tx);
    }

    return result;
  });

  const actorId = user ? user.id : "SYSTEM";
  const actorName = user ? user.name : "SYSTEM";
  const actorRole = user ? user.role : undefined;

  await auditLogService.createLog({
    borrowerId: updatedAssignment.borrowerId,
    module: "ASSIGNMENT",
    action: "UPDATE",
    details: `Assignment ${id} updated`,
    status: "SUCCESS",
    actorId,
    actorName,
    actorRole,
  });

  return updatedAssignment;
};

export const deleteAssignmentService = async (id: string, user?: any) => {
  const deletedAssignment = await prisma.$transaction(async (tx) => {
    const assignment = await tx.assignment.delete({
      where: { id },
    });

    if (assignment.agentId) {
      await updateAgentStats(assignment.agentId, tx);
    }

    return assignment;
  });

  const actorId = user ? user.id : "SYSTEM";
  const actorName = user ? user.name : "SYSTEM";
  const actorRole = user ? user.role : undefined;

  await auditLogService.createLog({
    borrowerId: deletedAssignment.borrowerId,
    module: "ASSIGNMENT",
    action: "DELETE",
    details: `Assignment ${id} deleted`,
    status: "SUCCESS",
    actorId,
    actorName,
    actorRole,
  });

  return deletedAssignment;
};

export const getAssignmentsByAgentIdService = async (agentId: string) => {
  // First verify the agent exists
  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
  });

  if (!agent) {
    throw new Error("Agent not found");
  }

  // Get all assignments for this agent with full borrower details
  const assignments = await prisma.assignment.findMany({
    where: { agentId },
    include: {
      borrower: {
        include: {
          socialProfiles: true,
          verifications: true,
          recoveryActions: true,
          locations: true,
        },
      },
      agent: {
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      },
    },
    orderBy: {
      assignedAt: 'desc',
    },
  });

  return assignments;
};
