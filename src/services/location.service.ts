import {prisma} from "../config/database";

export const getLocationsService = () => {
  return prisma.location.findMany({
    include: { borrower: { select: { name: true } } },
  });
};

export const createLocationService = (data: any) => {
  return prisma.location.create({
    data,
  });
};
