import { Router } from "express";
import {
    postExtrusionAvancedOrder
} from "../controllers/extrusion.controller";

const router = Router();

// Routes
router.post("/avancedOrder", postExtrusionAvancedOrder);

export default router;