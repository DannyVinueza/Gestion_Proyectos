import { Router } from "express";
import { 
        colaborarProyecto,
        colaborarProyectoAniadir,
        aceptarSolicitudColaborador,
        aceptarSolicitudColaboradorAniadir,
        rechazarSolicitudColaborador,
        rechazarSolicitudColaboradorAniadir,
        eliminarColaborador,
        cambiarPermisos,
        listarNotificaciones,
        listarPemrisos
        } from "../controllers/collaborators_controller.js";
import verAutenticacion from "../middlewares/autenticacion.js";

const router = Router();

router.get('/notificaciones/usuarios', verAutenticacion, listarNotificaciones)
router.get('/listar-permisos', verAutenticacion, listarPemrisos)
router.post('/colaborar-proyecto', verAutenticacion, colaborarProyecto)
router.post('/invitar-colaborador-proyecto', verAutenticacion, colaborarProyectoAniadir)
router.delete('/aceptar-colaboracion/:id', verAutenticacion, aceptarSolicitudColaborador)
router.delete('/aceptar-invitacion/:id', verAutenticacion, aceptarSolicitudColaboradorAniadir)
router.delete('/rechazar-colaboracion/:id', verAutenticacion, rechazarSolicitudColaborador)
router.delete('/rechazar-invitacion/:id', verAutenticacion, rechazarSolicitudColaboradorAniadir)
router.delete('/eliminar-colaborador/:colabId/:projectId', verAutenticacion, eliminarColaborador)
router.put('/cambiar-permiso/:colabId/:projectId', verAutenticacion, cambiarPermisos)

export default router;