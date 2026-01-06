import { prisma } from "../config/database";

export const getAlertsService = (userId: string) => {
  return prisma.alert.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const markAlertReadService = (id: string) => {
  return prisma.alert.update({
    where: { id },
    data: { read: true },
  });
};

export const createAlertService = (data: any) => {
  return prisma.alert.create({ data });
};

export const deleteAlertService = (id: string) => {
  return prisma.alert.delete({
    where: { id },
  });
};
