import { Router } from "express";
import {
    postCorteAvancedOrder
} from "../controllers/corte.controller";

const router = Router();

// Routes
router.post("/avancedOrder", postCorteAvancedOrder);

export default router;