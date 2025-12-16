import {prisma} from "../config/database";

// export const getDashboardStatsService = () => {
//   return prisma.dashboardStats.findFirst();
// };

export const getDashboardStatsService = async () => {
  // 1️⃣ Borrowers Count
  const totalBorrowers = await prisma.borrower.count();

  // 2️⃣ Verified Borrowers (using Boolean verified = true)
  const verified = await prisma.borrower.count({
    where: { verified: true },
  });

  // 3️⃣ Borrowers in Recovery (status = IN_RECOVERY)
  const inRecovery = await prisma.borrower.count({
    where: { status: "ACTIVE" },
  });

  // 4️⃣ Active Agents
  const activeAgents = await prisma.agent.count({
    where: { status: "ONLINE" },
  });

  // 5️⃣ Pending Verifications
  const pendingVerifications = await prisma.verification.count({
    where: { status: "PENDING" },
  });

  // 6️⃣ SLA Alerts (Example Logic: overdueDays > 30)
  const slaAlerts = await prisma.borrower.count({
    where: {
      overdueDays: {
        gt: 30,
      },
    },
  });

  // 7️⃣ Total Recovered Amount (from Agent.totalRecovered)
  const recoveredSum = await prisma.agent.aggregate({
    _sum: {
      totalRecovered: true,
    },
  });

  const totalRecovered = recoveredSum._sum.totalRecovered || 0;

  // 8️⃣ Recovery Rate = (verified / totalBorrowers) * 100
  const recoveryRate =
    totalBorrowers > 0
      ? Number(((verified / totalBorrowers) * 100).toFixed(2))
      : 0;

  return {
    totalBorrowers,
    verified,
    inRecovery,
    activeAgents,
    pendingVerifications,
    slaAlerts,
    totalRecovered,
    recoveryRate,
  };
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

