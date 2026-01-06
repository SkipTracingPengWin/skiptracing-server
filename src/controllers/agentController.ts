
import { Request, Response } from "express";
import { AgentService } from "../services/agent.service";


// @desc Get all agents
export const getAgents = async (req: Request, res: Response) => {
  try {
    const agents = await AgentService.getAgents();
    res.json(agents);
  } catch (error) {
    console.error("Error in getAgents:", error);
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

// @desc Get agent by ID
export const getAgentById = async (req: Request, res: Response) => {
  try {
    const agent = await AgentService.getAgentById(req.params.id);
    agent
      ? res.json(agent)
      : res.status(404).json({ message: "Agent not found" });
  } catch (error) {
    console.error("Error in getAgentById:", error);
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

// @desc Create agent
export const createAgent = async (req: Request, res: Response) => {
  try {
    const result = await AgentService.createAgent(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error in createAgent:", error);
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

// @desc Update agent
export const updateAgent = async (req: Request, res: Response) => {
  try {
    const updated = await AgentService.updateAgent(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    console.error("Error in updateAgent:", error);
    res.status(404).json({ message: "Agent not found", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

// @desc Delete agent
export const deleteAgent = async (req: Request, res: Response) => {
  try {
    await AgentService.deleteAgent(req.params.id);
    res.json({ message: "Agent removed" });
  } catch (error) {
    console.error("Error in deleteAgent:", error);
    res.status(404).json({ message: "Agent not found", error: error instanceof Error ? error.message : "Unknown error" });
  }
};
