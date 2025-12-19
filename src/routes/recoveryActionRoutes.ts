import { Router } from "express";
import {
    getRecoveryActions,
    createRecoveryAction,
    updateRecoveryActionStatus
} from "../controllers/recoveryAction.controller";

import { authorize, protect } from "../middleware/authMiddleware"; // if using RBAC

const router = Router();
router.use(protect);
router.route("/")
    .get(getRecoveryActions)
    .post(authorize("ADMIN"), createRecoveryAction);

router.route("/:id/status")
    .put(authorize("ADMIN"), updateRecoveryActionStatus);

export default router;
