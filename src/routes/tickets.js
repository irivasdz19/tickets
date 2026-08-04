// La ruta solo conecta URL + método con su controlador.

import { Router } from "express";
import * as ctrl from "../controllers/tickets.controller.js";
import { requireAuth, requireRol } from "../middlewares/auth.js";

const router = Router();

// Leer es público; escribir exige sesión. Borrar, además, rol admin.
router.get("/", ctrl.listar);
router.get("/:id", ctrl.obtener);
router.post("/", requireAuth, ctrl.crear);
router.patch("/:id", requireAuth, ctrl.actualizar);
router.delete("/:id", requireAuth, requireRol("admin"), ctrl.eliminar);

export default router;
