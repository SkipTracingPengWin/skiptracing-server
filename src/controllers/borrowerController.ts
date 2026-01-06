
import { Request, Response } from "express";
import { borrowerService } from "../services/borrower.service";

// GET ALL
export const getBorrowers = async (req: Request, res: Response) => {
  try {
    const borrowers = await borrowerService.getAll();
    res.json(borrowers);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET BY ID
export const getBorrowerById = async (req: Request, res: Response) => {
  try {
    const borrower = await borrowerService.getById(req.params.id);

    if (!borrower) {
      return res.status(404).json({ message: "Borrower not found" });
    }

    res.json(borrower);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE
export const createBorrower = async (req: Request, res: Response) => {
  try {
    const borrower = await borrowerService.create(req.body);
    res.status(201).json(borrower);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE
export const updateBorrower = async (req: Request, res: Response) => {
  try {
    const borrower = await borrowerService.update(req.params.id, req.body);
    res.json(borrower);
  } catch (error) {
    res.status(404).json({ message: "Borrower not found" });
  }
};

// DELETE
export const deleteBorrower = async (req: Request, res: Response) => {
  try {
    await borrowerService.delete(req.params.id);
    res.json({ message: "Borrower removed" });
  } catch (error) {
    res.status(404).json({ message: "Borrower not found" });
  }
};
