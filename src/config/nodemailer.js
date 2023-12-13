// Importsr nodmailer 
import nodemailer from "nodemailer"
import dotenv from 'dotenv'
dotenv.config()

// Creación del transporter
const transport = nodemailer.createTransport({
    host: process.env.HOST_MAILTRAP,
    port: process.env.PORT_MAILTRAP,
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP
    },
    service: 'gmail'
})

// send mail with defined transport object
const sendMailToUser = async (userMail, token) => {
    let info = await transport.sendMail({
        from: 'admin@vet.com',
        to: userMail,
        subject: "Verifica tu cuenta de correo electrónico",
        html: `
    <h1>Sistema gestión de proyectos</h1>
    <hr>
    <a href="https://gestor-proyectos-gqhd.onrender.com/api/confirmar/${token}">Clic para confirmar tu cuenta</a>
    <hr>
    <footer>Grandote te da la Bienvenida!</footer>
    `
    });
}

// html: `
//     <h1>Sistema gestión de proyectos</h1>
//     <hr>
//     <a href="http://localhost:3000/api/confirmar/${token}">Clic para confirmar tu cuenta</a>
//     <hr>
//     <footer>Bienvenido!</footer>
//     `
// send mail with defined transport object
const sendMailToRecoveryPassword = async (userMail, token) => {
    let info = await transport.sendMail({
        from: 'admin@vet.com',
        to: userMail,
        subject: "Correo para reestablecer tu contraseña",
        html: `
        <h1>Sistema gestión de proyectos</h1>
        <hr>
        <a href="https://gestor-proyectos-gqhd.onrender.com/api/recuperar-contrasenia/${token}">Clic para reestablecer tu contraseña</a>
        <hr>
        <footer>Grandote te da la Bienvenida!</footer>
        `
    });
}

// html: `
//     <h1>Sistema gestión de proyectos</h1>
//     <hr>
//     <a href="http://localhost:3000/api/recuperar-contrasenia/${token}">Clic para reestablecer tu contraseña</a>
//     <hr>
//     <footer>Bienvenido!</footer>
//     `
//Exportar la función
export {
    sendMailToUser,
    sendMailToRecoveryPassword
}