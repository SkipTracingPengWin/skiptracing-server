import { PrismaClient, BorrowerStatus } from "@prisma/client";

const prisma = new PrismaClient();

export const borrowerService = {
  getAll: async () => {
    return prisma.borrower.findMany({
      include: {
        assignments: true,
        verifications: true,
      },
    });
  },

  getById: async (id: string) => {
    return prisma.borrower.findUnique({
      where: { id },
      include: {
        assignments: true,
        verifications: true,
        skipTraceResults: true,
        recoveryActions: true,
        locations: true,
      },
    });
  },



create: async (data: any) => {
  return prisma.borrower.create({
    data: {
      ...data,
      status: data.status || BorrowerStatus.ACTIVE,
    
    },
  });
},



  update: async (id: string, data: any) => {
    return prisma.borrower.update({
      where: { id },
      data,
    });
  },

  delete: async (id: string) => {
    return prisma.borrower.delete({
      where: { id },
    });
  },
};
