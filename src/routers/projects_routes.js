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

router.get('/proyectos', verAutenticacion, listarProyectos)
router.get('/proyecto/:id', verAutenticacion, listarProyecto)
router.get('/proyectos/usuario', verAutenticacion, listarProyectosPorUsuario)
router.get('/proyectos/colaborador', verAutenticacion, listarProyectosColaboracion)
router.post('/crear-proyecto', verAutenticacion, crearProyecto)
router.put('/actualizar-proyecto/:id', verAutenticacion, actualizarProyecto)
router.delete('/eliminar-proyecto/:id', verAutenticacion, eliminarProyecto)

export default router;