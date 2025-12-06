
import { Request, Response } from "express";
import {
  getDashboardStatsService,
  updateDashboardStatsService,
} from "../services/dashboard.service";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const stats = await getDashboardStatsService();
    res.json(stats || {});
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateDashboardStats = async (req: Request, res: Response) => {
  try {
    const updated = await updateDashboardStatsService(req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
