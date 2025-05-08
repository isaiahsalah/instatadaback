import {Router} from "express";
import {getCorte} from "../controllers/corte.controller";

const router = Router();

// Routes
router.get("/corte", getCorte);

export default router;
