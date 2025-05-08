import {Router} from "express";
import {getExtrusion} from "../controllers/bolsas.controller";

const router = Router();

// Routes
router.get("/extrusion", getExtrusion);

export default router;
