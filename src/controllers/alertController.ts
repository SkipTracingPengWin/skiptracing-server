
import { Request, Response } from "express";
import {
  getAlertsService,
  markAlertReadService,
  createAlertService,
  deleteAlertService,
} from "../services/alert.service";

export const getAlerts = async (req: Request, res: Response) => {
  try {
    // Assuming req.user.id is the agent's ID when they are fetching their alerts
    const alerts = await getAlertsService(req.user!.id);
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const markAlertAsRead = async (req: Request, res: Response) => {
  try {
    const alert = await markAlertReadService(req.params.id);
    res.json(alert);
  } catch (error) {
    res.status(404).json({ message: "Alert not found" });
  }
};

export const createAlert = async (req: Request, res: Response) => {
  try {
    const { agentId, borrowerId, title, message, type } = req.body;

    // adminId comes from the authenticated user (admin)
    const adminId = req.user!.id;

    const alert = await createAlertService({
      adminId,
      agentId,
      borrowerId, // Optional
      title,
      message,
      type
    });

    res.status(201).json(alert);
  } catch (error) {
    console.error("Error creating alert:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteAlert = async (req: Request, res: Response) => {
  try {
    await deleteAlertService(req.params.id);
    res.json({ message: "Alert removed" });
  } catch (error) {
    res.status(404).json({ message: "Alert not found" });
  }
};
