import { Router } from "express";
import { 
    actualizarProyecto,
    crearProyecto,
        eliminarProyecto,
        listarProyecto,
        listarProyectos,
        listarProyectosPorUsuario,
        listarProyectosColaboracion
       } from "../controllers/projects_controller.js";
import verAutenticacion from "../middlewares/autenticacion.js";

const router = Router();

router.get('/proyectos', listarProyectos)
router.get('/proyecto/:id', listarProyecto)
router.get('/proyectos/usuario', verAutenticacion, listarProyectosPorUsuario)
router.get('/proyectos/colaborador', verAutenticacion, listarProyectosColaboracion)
router.post('/crear-proyecto', crearProyecto)
router.put('/actualizar-proyecto/:id', actualizarProyecto)
router.delete('/eliminar-proyecto/:id', eliminarProyecto)

export default router;