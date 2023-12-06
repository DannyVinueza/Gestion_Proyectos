import { Router } from "express";
import {
        comprobarConstraseniaToken, 
        confirmarEmail, 
        login, 
        nuevaContrasenia, 
        recuperarContrasenia, 
        registro } from "../controllers/users_controller.js";

const router = Router();

router.post('/login', login);
router.get('/confirmar/:token', confirmarEmail);
router.get('/recuperar-contrasenia/:token', comprobarConstraseniaToken)
router.post('/registrar', registro);
router.post('/recuperar-contrasenia', recuperarContrasenia);
router.post('/nueva-contrasenia/:token', nuevaContrasenia);

export default router;