import {Router} from "express";
import {getCorte, getExtrusion, getImpresion} from "../controllers/bolsas.controller";

const router = Router();

// Routes
router.get("/extrusion", getExtrusion);
router.get("/corte", getCorte);
router.get("/impresion", getImpresion);

export default router;
