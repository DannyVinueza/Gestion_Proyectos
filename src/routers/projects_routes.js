import { Router } from "express";
import { 
    actualizarProyecto,
    crearProyecto,
        eliminarProyecto,
        listarProyecto,
        listarProyectos 
       } from "../controllers/projects_controller.js";

const router = Router();

router.get('/proyectos', listarProyectos)
router.get('/proyecto/:id', listarProyecto)
router.post('/crear-proyecto', crearProyecto)
router.put('/actualizar-proyecto/:id', actualizarProyecto)
router.delete('/eliminar-proyecto/:id', eliminarProyecto)

export default router;