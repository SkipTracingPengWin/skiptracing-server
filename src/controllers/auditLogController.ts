
import { Request, Response } from "express";
import {
  getAuditLogsService,
  createAuditLogService,
} from "../services/auditlog.service";

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const logs = await getAuditLogsService();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createAuditLog = async (req: Request, res: Response) => {
  try {
    const log = await createAuditLogService(req.body, req.user?.id!);
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
