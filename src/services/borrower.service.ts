import { PrismaClient, BorrowerStatus } from "@prisma/client";
import { auditLogService } from "./auditLogService";
import { OsmService } from "./osm.service";

const prisma = new PrismaClient();

export const borrowerService = {
  getAll: async (user?: any) => {
    let whereClause: any = {};

    if (user && user.role === "AGENT") {
      // Find the agent profile associated with this user
      const agentProfile = await prisma.agent.findUnique({
        where: { userId: user.id },
      });

      if (agentProfile) {
        whereClause = {
          assignments: {
            some: {
              agentId: agentProfile.id,
            },
          },
        };
      } else {
        // If user is AGENT role but has no Agent profile, they shouldn't see any borrowers or maybe handle error
        // For safety, return empty list or allow strict filter that won't match anything
        whereClause = { id: "non-existent" };
      }
    }

    const borrowers = await prisma.borrower.findMany({
      where: whereClause,
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

  create: async (data: any, user?: any) => {
    const newBorrower = await prisma.borrower.create({
      data: {
        ...data,
        status: data.status || BorrowerStatus.ACTIVE,
      },
    });

    const actorId = user ? user.id : "SYSTEM";
    const actorName = user ? user.name : "SYSTEM";
    const actorRole = user ? user.role : undefined;

    await auditLogService.createLog({
      borrowerId: newBorrower.id,
      module: "BORROWER",
      action: "CREATE",
      details: `Borrower ${newBorrower.name} created`,
      status: "SUCCESS",
      actorId,
      actorName,
      actorRole,
    });

    return newBorrower;
  },

  update: async (id: string, data: any, user?: any) => {
    const updatedBorrower = await prisma.borrower.update({
      where: { id },
      data,
    });

    const actorId = user ? user.id : "SYSTEM";
    const actorName = user ? user.name : "SYSTEM";
    const actorRole = user ? user.role : undefined;

    await auditLogService.createLog({
      borrowerId: id,
      module: "BORROWER",
      action: "UPDATE",
      details: `Borrower details updated`,
      status: "SUCCESS",
      actorId,
      actorName,
      actorRole,
    });

    return updatedBorrower;
  },

  delete: async (id: string, user?: any) => {
    const deletedBorrower = await prisma.borrower.delete({
      where: { id },
    });

    const actorId = user ? user.id : "SYSTEM";
    const actorName = user ? user.name : "SYSTEM";
    const actorRole = user ? user.role : undefined;

    await auditLogService.createLog({
      borrowerId: id,
      module: "BORROWER",
      action: "DELETE",
      details: `Borrower deleted`,
      status: "SUCCESS",
      actorId,
      actorName,
      actorRole,
    });

    return deletedBorrower;
  },

  fetchAndStoreLocation: async (borrowerId: string, user?: any) => {
    const borrower = await prisma.borrower.findUnique({
      where: { id: borrowerId },
    });

    if (!borrower) throw new Error("Borrower not found");
    if (!borrower.address) throw new Error("Borrower has no address to search");

    const osmResults = await OsmService.searchAddress(borrower.address);

    if (!osmResults || osmResults.length === 0) {
      throw new Error("No location results found from OpenStreetMap");
    }

    const bestMatch = osmResults[0];

    // Create Location record
    const location = await prisma.location.create({
      data: {
        borrowerId,
        latitude: parseFloat(bestMatch.lat),
        longitude: parseFloat(bestMatch.lon),
        address: bestMatch.display_name,
        source: "OpenStreetMap",
        confidence: "High",
        // @ts-ignore: Prisma client outdated due to file lock
        metadata: bestMatch as any,
        lastSeen: new Date(),
      },
    });

    // Update Borrower's main location field as well for quick access
    await prisma.borrower.update({
      where: { id: borrowerId },
      data: {
        location: `${bestMatch.lat}, ${bestMatch.lon}`,
      },
    });

    const actorId = user ? user.id : "SYSTEM";
    const actorName = user ? user.name : "SYSTEM";
    const actorRole = user ? user.role : undefined;

    await auditLogService.createLog({
      borrowerId,
      module: "BORROWER",
      action: "UPDATE",
      details: `Location updated via OpenStreetMap: ${bestMatch.display_name}`,
      status: "SUCCESS",
      actorId,
      actorName,
      actorRole,
    });

    return location;
  },
};

const calculateOverdueDays = (dueDate: Date | null) => {
  const today = new Date();

  if (!dueDate || today <= dueDate) return 0;

  const diff = today.getTime() - dueDate.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};
