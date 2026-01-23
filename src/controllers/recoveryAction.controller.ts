import { Request, Response } from "express";
import {
    getRecoveryActionsService,
    createRecoveryActionService,
    updateRecoveryActionStatusService
} from "../services/recoveryAction.service";

export const getRecoveryActions = async (req: Request, res: Response) => {
    try {
        const actions = await getRecoveryActionsService(req.user);
        res.status(200).json(actions);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const createRecoveryAction = async (req: Request, res: Response) => {
    try {
        const action = await createRecoveryActionService(req.body, req.user);
        res.status(201).json(action);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const updateRecoveryActionStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        const updated = await updateRecoveryActionStatusService(id, status, req.user);

        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
