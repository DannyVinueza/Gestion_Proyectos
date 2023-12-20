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
        from: 'soporte@gestionproyectos.com',
        to: userMail,
        subject: "Verifica tu cuenta de correo electrónico",
        html: `
        <h1>Sistema gestión de proyectos</h1>
        <hr>
        <p>Hola bienvenido al sistema de gestión de proyectos, por favor da click en el enlace de abajo para confirmar tu cuenta</p>
        <a href="${process.env.URLDOMAIN}/api/confirmar/${token}">Clic para confirmar tu cuenta</a>
        <hr>
        <footer>Bienvenido!</footer>
        `
    });
}

// send mail with defined transport object
const sendMailToRecoveryPassword = async (userMail, token) => {
    let info = await transport.sendMail({
        from: 'soporte@gestionproyectos.com',
        to: userMail,
        subject: "Correo para reestablecer tu contraseña",
        html: `
        <h1>Sistema gestión de proyectos</h1>
        <hr>
        <a href="${process.env.URLDOMAIN}/api/recuperar-contrasenia/${token}">Clic para reestablecer tu contraseña</a>
        <hr>
        <footer>Bienvenido!</footer>
        `
    });
}

const sendNotificationNewColaboradorProject = async (colabProject, ownerProject, project_title) => {
    let info = await transport.sendMail({
        from: 'soporte@gestionproyectos.com',
        to: ownerProject,
        subject: "Nuevo colaborador",
        html: `
        <h1>Sistema gestión de proyectos -- Solicitud de colaboración</h1>
        <hr>
            <p>${colabProject.full_name} / ${colabProject.occupation}<br>
            Te a pedido unirse en tu proyecto: ${project_title}<br>
            </p>
            <a href="${process.env.URLDOMAINWEB}">Clic para ir a la pantalla de aceptar o rechazar la solicitud</a>
        <hr>
        <footer>Gestión de proyectos</footer>
        `
    })
}

const aceptRejectionNotificationNewColaboradorProject = async (colabProject, project_title, status) => {
    let info = await transport.sendMail({
        from: 'soporte@gestionproyectos.com',
        to: colabProject.email_user,
        subject: "Notificación de colaboración",
        html: `
        <h1>Sistema gestión de proyectos -- Notificación de colaboración</h1>
        <hr>
            <p>${colabProject.full_name} / ${colabProject.occupation}<br>
            Ha sido ${status} en el proyecto: ${project_title}<br>
            </p>
        <hr>
        <footer>Gestión de proyectos</footer>
        `
    })
}

//Exportar la función
export {
    sendMailToUser,
    sendMailToRecoveryPassword,
    sendNotificationNewColaboradorProject,
    aceptRejectionNotificationNewColaboradorProject
}