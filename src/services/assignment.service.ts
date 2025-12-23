import { prisma } from "../config/database";
import { AssignmentStatus } from "@prisma/client";

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

export const createAssignmentService = (data: any) => {
  return prisma.$transaction(async (prisma) => {
    // 1. Create Assignment
    const assignment = await prisma.assignment.create({
      data: {
        ...data,
        status: AssignmentStatus.OPEN,
      },
    });

    // 2. Increment Agent's case count
    if (data.agentId) {
      await prisma.agent.update({
        where: { id: data.agentId },
        data: {
          cases: { increment: 1 },
        },
      });
    }

    return assignment;
  });
};

export const updateAssignmentService = (id: string, data: any) => {
  return prisma.assignment.update({
    where: { id },
    data,
  });
};

export const deleteAssignmentService = (id: string) => {
  return prisma.assignment.delete({
    where: { id },
  });
};
