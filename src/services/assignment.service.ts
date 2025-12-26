import { prisma } from "../config/database";
import { AssignmentStatus, Prisma } from "@prisma/client";

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
  const closedCases = assignments.filter(
    (a: any) => a.status === AssignmentStatus.CLOSED
  );

  const successRate =
    totalCases > 0 ? (closedCases.length / totalCases) * 100 : 0;

  const totalRecovered = closedCases.reduce((sum: number, a: any) => {
    return sum + (a.borrower?.amountNumeric || 0);
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

export const createAssignmentService = (data: any) => {
  return prisma.$transaction(async (tx) => {
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
};

export const updateAssignmentService = async (id: string, data: any) => {
  return prisma.$transaction(async (tx) => {
    const result = await tx.assignment.update({
      where: { id },
      data,
    });

    if (result.agentId) {
      await updateAgentStats(result.agentId, tx);
    }

    return result;
  });
};

export const deleteAssignmentService = async (id: string) => {
  return prisma.$transaction(async (tx) => {
    const assignment = await tx.assignment.delete({
      where: { id },
    });

    if (assignment.agentId) {
      await updateAgentStats(assignment.agentId, tx);
    }

    return assignment;
  });
};
