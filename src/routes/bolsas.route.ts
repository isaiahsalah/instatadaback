import {Router} from "express";
import {
  getCorte,
  getEmbultaje,
  getEmpaque,
  getExtrusion,
  getImpresion,
} from "../controllers/bolsas.controller";

const router = Router();

// Routes
router.get("/extrusion", getExtrusion);
router.get("/corte", getCorte);
router.get("/impresion", getImpresion);
router.get("/empaque", getEmpaque);
router.get("/embultaje", getEmbultaje);

export default router;
