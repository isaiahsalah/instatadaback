import {Router} from "express";
import {getImpresion} from "../controllers/impresion.controller";

const router = Router();

// Routes
router.get("/impresion", getImpresion);

export default router;
