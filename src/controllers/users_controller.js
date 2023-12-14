import Users from "../models/Users.js";
import sequelize from "../database.js";
import generarJWT from "../helpers/crearJWT.js";
import { sendMailToUser, sendMailToRecoveryPassword } from "../config/nodemailer.js"

const MAX_EMAIL_ANCHO = 64;
const MAX_PASSWORD_ANCHO = 32;
const MAX_FULL_NAME_ANCHO = 64;
const MAX_UNIVERSITY_NAME_ANCHO = 64;
const MAX_CELLPHONE_NUMBER_ANCHO = 20;
const MAX_LINK_IMAGE_ANCHO = 160;
const MAX_CAREER_ANCHO = 150;
const MAX_OCCUPATION_ANCHO = 32;

const login = async (req, res) => {
    const { email, contrasenia } = req.body
    const parametrosRequeridos = [email, contrasenia];
    if (parametrosRequeridos.some(field => field === "" || field === undefined)) return res.status(400).json({ status: false, msg: 'Debe llenar todos los parametos requeridos' })
    try {
        const userBDD = await Users.findOne({
            where: {
                email_user: email
            }
        })

        if (!userBDD) return res.status(404).json({ status: false, msg: "Lo sentimos, el usuario no se encuentra registrado" })

        if (userBDD?.confirmarEmail === false) return res.status(403).json({ status: false, msg: "Lo sentimos, debe verificar su cuenta" })

        const verificarContrasenia = await userBDD.matchPassword(contrasenia)
        if (!verificarContrasenia) return res.status(404).json({ status: false, msg: "Lo sentimos, el password no es el correcto" })

        const token = await generarJWT(userBDD.id)
        const { id, full_name, university_name, cellphone_number, link_image, career, occupation } = userBDD


        res.status(200).json({
            status: true,
            token,
            id:id,
            nombreCompleto: full_name,
            universidad: university_name,
            celular: cellphone_number,
            linkImagen: link_image,
            carrera: career,
            ocupacion: occupation
        })
    } catch (error) {
        res.status(500).json({ status: false, errorA: 'Error interno del servidor', error })
    }
}

const registro = async (req, res) => {
    const { email, contrasenia, nombres, universidad, carrera, numero_celular, ocupacion, link_imagen_perfil } = req.body;

    const parametrosRequeridos = [email, contrasenia, nombres, universidad, carrera, numero_celular, ocupacion];
    if (parametrosRequeridos.some(field => field === "" || field === undefined)) return res.status(400).json({ status: false, msg: 'Debe llenar todos los parametos requeridos' })

    if (contrasenia.length < 8) return res.status(400).json({ status: false, msg: 'Por favor ingrese con una longitud mayor' });

    if (email.length > MAX_EMAIL_ANCHO ||
        contrasenia.length > MAX_PASSWORD_ANCHO ||
        nombres.length > MAX_FULL_NAME_ANCHO ||
        universidad.length > MAX_UNIVERSITY_NAME_ANCHO ||
        numero_celular.length > MAX_CELLPHONE_NUMBER_ANCHO ||
        link_imagen_perfil.length > MAX_LINK_IMAGE_ANCHO ||
        carrera.length > MAX_CAREER_ANCHO ||
        ocupacion.length > MAX_OCCUPATION_ANCHO) {
        return res.status(400).json({ status: false, msg: 'Los datos exceden la longitud máxima permitida' });
    }

    const user = await Users.findOne({
        where: {
            email_user: email
        }
    })

    if (user) return res.status(400).json({ status: false, msg: 'Lo sentimos el email ya se encuentra registrado' })

    const nuevoUsuario = new Users(req.body);

    const token = nuevoUsuario.crearToken()

    await sendMailToUser(email, token);

    await Users.create({
        email_user: email,
        password_user: await nuevoUsuario.encrypPassword(contrasenia),
        full_name: nombres,
        university_name: universidad,
        cellphone_number: numero_celular,
        link_image: link_imagen_perfil || "vaimgen_default",
        career: carrera,
        occupation: ocupacion,
        token: token

    })
        .then(() => {
            res.status(200).json({ status: true, msg: "Usuario registrado" })
        })
        .catch((error) => {
            console.log("Error al registrar al nuevo usuario ", error)
            res.status(500).json({ status: false, error: 'Error interno del servidor', error })
        })
}


const recuperarContrasenia = async (req, res) => {
    const { email } = req.body

    const parametrosRequeridos = [email]

    if (parametrosRequeridos.some(field => field === "" || field === undefined)) return res.status(400).json({ status: false, msg: 'Debe llenar todos los campos' })
    try {
        const userBDD = await Users.findOne({
            where: {
                email_user: email
            }
        })
        console.log(userBDD)

        if (!userBDD) return res.status(404).json({ status: false, msg: 'Lo sentimos, el usuario no se encuentra registrado' })

        const token = userBDD.crearToken()

        userBDD.token = token

        await sendMailToRecoveryPassword(email, token)

        await userBDD.save()
        res.status(200).json({ status: true, msg: "Revisa tu correo electronico para cambiar la contraseña" })
    } catch (error) {
        res.status(500).json({ status: false, error: 'Error interno del servidor', error })
    }

}

const comprobarConstraseniaToken = async (req, res) => {
    const { token } = req.params;
    if (!(token)) return res.status(400).json({ status: false, msg: "Lo sentimos, no se puede validar la cuenta" })
    try {
        const userBDD = await Users.findOne({
            where: {
                token
            }
        })

        if (userBDD?.token !== token) return res.status(404).json({ status: false, msg: 'Lo sentimos, no se puede validar la cuenta' })

        await userBDD.save()
        res.status(200).json({ status: true, msg: "Token confirmado, ya puedes crear tu nuevo password" })
    } catch (error) {
        res.status(500).json({ status: false, msg: "Error interno del servidor", error })
    }

}

const confirmarEmail = async (req, res) => {
    const { token } = req.params;
    try {
        if (!(token)) return res.status(400).json({ status: false, msg: "Lo sentimos, no se puede validar la cuenta" })
        const userBDD = await Users.findOne({
            where: {
                token
            }
        })

        if (!userBDD?.token) return res.status(404).json({ status: false, msg: "La cuenta ya a sido confirmada" })

        userBDD.token = null
        userBDD.confirmarEmail = true

        await userBDD.save()

        res.status(200).json({ status: true, msg: "Token cofirmado, ya puede iniciar sesión" })

    } catch (error) {
        res.status(500).json({ status: false, msg: "Error interno del servidor", error })
    }
}

const nuevaContrasenia = async (req, res) => {
    const { token } = req.params;
    const { contrasenia, confirmar_contrasenia } = req.body

    const parametrosRequeridos = [contrasenia, confirmar_contrasenia]

    if (parametrosRequeridos.some(field => field === "" || field === undefined)) return res.status(400).json({ status: false, msg: 'Debe llenar todos los campos' })
    try {
        if (contrasenia != confirmar_contrasenia) return res.status(404).json({ msg: "Lo sentimos, los passwords no coinciden" })
        if (!(token)) return res.status(400).json({ status: false, msg: "Lo sentimos, no se puede validar la cuenta" })

        const userBDD = await Users.findOne({
            where: {
                token
            }
        })

        if (!userBDD || !userBDD.token) {
            return res.status(404).json({ status: false, msg: "Token inválido o cuenta ya validada" });
        }

        userBDD.token = null
        userBDD.password_user = await userBDD.encrypPassword(contrasenia)

        await userBDD.save()
        res.status(200).json({ msg: "Felicitaciones, ya puedes iniciar sesión con tu nuevo password" })
    } catch (error) {
        res.status(500).json({ status: false, msg: "Error interno del servidor", error })
    }

}

const actualizarPerfil = async (req, res) => {
    const { id } = req.params;
    const { universidad, carrera, numero_celular, link_imagen_perfil } = req.body;

    if (!id) return res.status(404).json({ status: false, msg: 'Lo sentimos debe ser un id valido' })
    const parametrosRequeridos = [universidad, carrera, numero_celular, link_imagen_perfil];
    if (parametrosRequeridos.some(field => field === undefined)) return res.status(400).json({ status: false, msg: 'Debe utilizar todos los parametos requeridos' })

    if (universidad.length > MAX_UNIVERSITY_NAME_ANCHO || numero_celular.length > MAX_CELLPHONE_NUMBER_ANCHO ||
        link_imagen_perfil.length > MAX_LINK_IMAGE_ANCHO ||
        carrera.length > MAX_CAREER_ANCHO
    ) {
        return res.status(400).json({ status: false, msg: 'Los datos exceden la longitud máxima permitida' });
    }
    try {
        const userBDD = await Users.findByPk(id);
        if (!userBDD) return res.status(404).json({ status: false, msg: 'Lo sentimos no existe el usuario' })

        await userBDD.update({
            university_name: universidad || userBDD.university_name,
            cellphone_number: numero_celular || userBDD.cellphone_number,
            link_image: link_imagen_perfil || userBDD.link_image,
            career: carrera || userBDD.career,
        })
        return res.status(200).json({ status: true, msg: 'Perfil actualizado' })
    } catch (error) {
        res.status(500).json({ status: false, msg: "Error interno del servidor", error })
    }
}

const listarPerfil = async (req, res) => {
    try {
        const { id } = req.params

        const userBDD = await Users.findByPk(id)
        if (!userBDD) return res.status(400).json({ status: false, msg: 'El perfil no se encuentra' })

        res.status(200).json({ status: true, usuario: userBDD })
    } catch (error) {
        res.status(500).json({ status: false, msg: "Error interno del servidor", error })
    }
}

export {
    login,
    registro,
    confirmarEmail,
    recuperarContrasenia,
    comprobarConstraseniaToken,
    nuevaContrasenia,
    actualizarPerfil,
    listarPerfil
}