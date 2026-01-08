
import { Request, Response } from "express";
import {
  getAssignmentsService,
  getAssignmentByIdService,
  createAssignmentService,
  updateAssignmentService,
  deleteAssignmentService,
} from "../services/assignment.service";

export const getAssignments = async (req: Request, res: Response) => {
  try {
    const assignments = await getAssignmentsService();
    res.json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAssignmentById = async (req: Request, res: Response) => {
  try {
    const assignment = await getAssignmentByIdService(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createAssignment = async (req: Request, res: Response) => {
  try {
    const assignment = await createAssignmentService(req.body, req.user);
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateAssignment = async (req: Request, res: Response) => {
  try {
    const assignment = await updateAssignmentService(req.params.id, req.body, req.user);
    res.json(assignment);
  } catch (error) {
    res.status(404).json({ message: "Assignment not found" });
  }
};

export const deleteAssignment = async (req: Request, res: Response) => {
  try {
    await deleteAssignmentService(req.params.id, req.user);
    res.json({ message: "Assignment removed" });
  } catch (error) {
    res.status(404).json({ message: "Assignment not found" });
  }
};
