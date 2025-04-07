import { Router } from "express";
import {
    postImpresionAvancedOrder
} from "../controllers/impresion.controller";

const router = Router();

// Routes
router.post("/avancedOrder", postImpresionAvancedOrder);

export default router;