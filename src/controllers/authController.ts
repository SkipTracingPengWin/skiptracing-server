import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { generateToken } from "../utils/generateToken";

// @desc Register
export const registerUser = async (req: Request, res: Response) => {
  try {
    const user = await AuthService.register(req.body);

    if (!user)
      return res.status(400).json({ message: "User already exists" });

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Login
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await AuthService.login(email, password);

    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Profile
export const profile = async (req: Request, res: Response) => {
  try {
    const user = await AuthService.getProfile(req.user!.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
