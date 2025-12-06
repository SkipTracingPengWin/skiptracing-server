import {prisma} from "../config/database";

export const getDashboardStatsService = () => {
  return prisma.dashboardStats.findFirst();
};

export const updateDashboardStatsService = async (data: any) => {
  const existing = await prisma.dashboardStats.findFirst();

  if (existing) {
    return prisma.dashboardStats.update({
      where: { id: existing.id },
      data,
    });
  }

  return prisma.dashboardStats.create({
    data,
  });
};
