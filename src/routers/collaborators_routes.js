import { Router } from "express";
import { 
        colaborarProyecto,
        aceptarSolicitudColaborador,
        rechazarSolicitudColaborador,
        eliminarColaborador,
        cambiarPermisos,
        crearNuevoPermiso,
        listarNotificaciones
        } from "../controllers/collaborators_controller.js";
import verAutenticacion from "../middlewares/autenticacion.js";

const router = Router();

router.get('/notificaciones/usuarios', verAutenticacion, listarNotificaciones)
router.post('/colaborar-proyecto', colaborarProyecto)
router.delete('/aceptar-colaboracion/:id', aceptarSolicitudColaborador)
router.delete('/rechazar-colaboracion/:id', rechazarSolicitudColaborador)
router.delete('/eliminar-colaborador/:colabId/:projectId', eliminarColaborador)
router.put('/cambiar-permiso/:colabId/:projectId', cambiarPermisos)
router.post('/crear-permiso', crearNuevoPermiso)

export default router;