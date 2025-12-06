import {prisma} from "../config/database";

export const getRecoveryTrendsService = async () => {
    return await prisma.recoveryTrend.findMany({
        orderBy: { month: "asc" },
    });
};

export const createRecoveryTrendService = async (data: any) => {
    return await prisma.recoveryTrend.create({
        data,
    });
};
