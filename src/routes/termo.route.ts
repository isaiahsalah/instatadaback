import {Router} from "express";
import {getCorte, getEmbultaje, getExtrusion} from "../controllers/termo.controller";

const router = Router();

// Routes
router.get("/extrusion", getExtrusion);
router.get("/corte", getCorte);
router.get("/embultaje", getEmbultaje);

export default router;
