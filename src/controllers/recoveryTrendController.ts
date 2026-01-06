
import { Request, Response } from "express";
import {
    getRecoveryTrendsService,
    createRecoveryTrendService,
} from "../services/recoverytrend.service";

export const getRecoveryTrends = async (req: Request, res: Response) => {
    try {
        const trends = await getRecoveryTrendsService();
        res.json(trends);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const createRecoveryTrend = async (req: Request, res: Response) => {
    try {
        const trend = await createRecoveryTrendService(req.body);
        res.status(201).json(trend);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
