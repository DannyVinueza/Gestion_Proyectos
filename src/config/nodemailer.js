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
    }
})

// send mail with defined transport object
const sendMailToUserTest = async (userMail, token) => {
    let info = await transport.sendMail({
        from: 'soporte@gestionproyectos.com',
        to: userMail,
        subject: "Verificar cuenta de correo electrónico",
        html: `
        <h1>Sistema gestión de proyectos</h1>
        <hr>
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

const sendNotificationNewColaboradorProjectAdd = async (colabProject, ownerProject, project_title) => {
    let info = await transport.sendMail({
        from: 'soporte@gestionproyectos.com',
        to: colabProject.email_user,
        subject: "Nuevo colaborador",
        html: `
        <h1>Sistema gestión de proyectos -- Solicitud para colaboración de un proyecto</h1>
        <hr>
            <p>${ownerProject.full_name} / ${ownerProject.occupation}<br>
            Ha solicitado que se una en el proyecto: ${project_title}<br>
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

const aceptRejectionNotificationNewColaboradorProjectAdd = async (colabProject, project_title, status, ownerEmail) => {
    let info = await transport.sendMail({
        from: 'soporte@gestionproyectos.com',
        to: ownerEmail,
        subject: "Notificación de colaboración",
        html: `
        <h1>Sistema gestión de proyectos -- Notificación de colaboración</h1>
        <hr>
            <p>${colabProject.full_name} / ${colabProject.occupation}<br>
             ${status} en el proyecto: ${project_title}<br>
            </p>
        <hr>
        <footer>Gestión de proyectos</footer>
        `
    })
}

//Exportar la función
export {
    sendMailToUserTest,
    sendMailToRecoveryPassword,
    sendNotificationNewColaboradorProject,
    sendNotificationNewColaboradorProjectAdd,
    aceptRejectionNotificationNewColaboradorProject,
    aceptRejectionNotificationNewColaboradorProjectAdd
}