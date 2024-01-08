import { Router } from "express";
import {
        actualizarPerfil,
        comprobarConstraseniaToken, 
        confirmarEmail, 
        listarPerfil, 
        login, 
        nuevaContrasenia, 
        recuperarContrasenia, 
        registro,
        listarUsuarios 
        } from "../controllers/users_controller.js";
import verAutenticacion from "../middlewares/autenticacion.js";

const router = Router();

router.post('/login', login);
router.get('/confirmar/:token', confirmarEmail);
router.get('/usuarios', verAutenticacion, listarUsuarios);
router.get('/recuperar-contrasenia/:token', comprobarConstraseniaToken)
router.get('/perfil/:id', verAutenticacion, listarPerfil)
router.post('/registrar', registro);
router.post('/recuperar-contrasenia', recuperarContrasenia);
router.post('/nueva-contrasenia/:token', verAutenticacion, nuevaContrasenia);
router.put('/usuario/:id', verAutenticacion, actualizarPerfil)

export default router;