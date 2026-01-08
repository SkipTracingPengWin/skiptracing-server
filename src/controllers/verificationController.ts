
import { Request, Response } from "express";
import {
  getVerificationsService,
  createVerificationService,
  updateVerificationService,
  deleteVerificationService,
} from "../services/verification.service";

export const getVerifications = async (req: Request, res: Response) => {
  try {
    const verifications = await getVerificationsService();
    res.json(verifications);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createVerification = async (req: Request, res: Response) => {
  try {
    const verification = await createVerificationService(req.body, req.user);
    res.status(201).json(verification);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateVerification = async (req: Request, res: Response) => {
  try {
    const verification = await updateVerificationService(
      req.params.id,
      req.body,
      req.user
    );
    res.json(verification);
  } catch (error) {
    res.status(404).json({ message: "Verification not found" });
  }
};

export const deleteVerification = async (req: Request, res: Response) => {
  try {
    await deleteVerificationService(req.params.id, req.user);
    res.json({ message: "Verification removed" });
  } catch (error) {
    res.status(404).json({ message: "Verification not found" });
  }
};
