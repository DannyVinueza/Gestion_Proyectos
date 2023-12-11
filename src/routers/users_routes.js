import { Router } from "express";
import {
        actualizarPerfil,
        comprobarConstraseniaToken, 
        confirmarEmail, 
        listarPerfil, 
        login, 
        nuevaContrasenia, 
        recuperarContrasenia, 
        registro } from "../controllers/users_controller.js";

const router = Router();

router.post('/login', login);
router.get('/confirmar/:token', confirmarEmail);
router.get('/recuperar-contrasenia/:token', comprobarConstraseniaToken)
router.get('/perfil/:id', listarPerfil)
router.post('/registrar', registro);
router.post('/recuperar-contrasenia', recuperarContrasenia);
router.post('/nueva-contrasenia/:token', nuevaContrasenia);
router.put('/usuario/:id', actualizarPerfil)

export default router;