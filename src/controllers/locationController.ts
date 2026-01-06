
import { Request, Response } from "express";
import {
  getLocationsService,
  createLocationService,
} from "../services/location.service";

export const getLocations = async (req: Request, res: Response) => {
  try {
    const locations = await getLocationsService();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createLocation = async (req: Request, res: Response) => {
  try {
    const location = await createLocationService(req.body);
    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
