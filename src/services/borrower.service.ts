import { PrismaClient, BorrowerStatus } from "@prisma/client";

const prisma = new PrismaClient();

export const borrowerService = {
  getAll: async () => {
    const borrowers = await prisma.borrower.findMany({
      include: {
        assignments: true,
        verifications: true,
      },
    });

    // Calculate and update overdue days for each borrower
    // We use Promise.all to run updates in parallel but return the list with calculations
    const updatedBorrowers = await Promise.all(
      borrowers.map(async (borrower) => {
        // Use borrower's dueDate
        const overdueDays = calculateOverdueDays(borrower.dueDate ? new Date(borrower.dueDate) : null);

        if (borrower.overdueDays !== overdueDays) {
          // Update in DB if changed
          await prisma.borrower.update({
            where: { id: borrower.id },
            data: { overdueDays },
          });
          return { ...borrower, overdueDays };
        }
        return borrower;
      })
    );

    return updatedBorrowers;
  },

  getById: async (id: string) => {
    const borrower = await prisma.borrower.findUnique({
      where: { id },
      include: {
        assignments: true,
        verifications: true,
        skipTraceResults: true,
        recoveryActions: true,
        locations: true,
        socialProfiles: true,
      },
    });

    if (!borrower) return null;

    // Calculate overdue days using borrower's dueDate
    const overdueDays = calculateOverdueDays(borrower.dueDate ? new Date(borrower.dueDate) : null);

    if (borrower.overdueDays !== overdueDays) {
      // Update in DB if changed
      const updatedBorrower = await prisma.borrower.update({
        where: { id: borrower.id },
        data: { overdueDays },
        include: {
          assignments: true,
          verifications: true,
          skipTraceResults: true,
          recoveryActions: true,
          locations: true,
          socialProfiles: true,
        },
      });
      return updatedBorrower;
    }

    return borrower;
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

const calculateOverdueDays = (dueDate: Date | null) => {
  const today = new Date();

  if (!dueDate || today <= dueDate) return 0;

  const diff = today.getTime() - dueDate.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};
