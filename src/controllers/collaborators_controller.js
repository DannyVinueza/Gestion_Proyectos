import Projects_Users from "../models/Projects_Users.js";
import Permissions from "../models/Permissions.js";
import Users from "../models/Users.js";
import Projects from "../models/Projects.js";
import {
    sendNotificationNewColaboradorProject,
    aceptRejectionNotificationNewColaboradorProject
} from "../config/nodemailer.js";
import Notifications from "../models/Notifications.js";

const MAX_TITLE_PERMISSION = 32;

const colaborarProyecto = async (req, res) => {
    try {
        const { id_proyecto, id_usuario_colaborador } = req.body

        const userCola = await Users.findByPk(id_usuario_colaborador)
        if (!userCola) return res.status(400).json({ status: false, msg: 'Usuario no encontrado' })

        const projectCola = await Projects.findByPk(id_proyecto)
        if (!projectCola) return res.status(400).json({ status: false, msg: 'Proyecto no encontrado' })

        const project_user = await Projects_Users.findAll({
            where: {
                projectId: projectCola.id,
                userId: userCola.id,
                owner: 1
            }
        })
        console.log(project_user)

        if (project_user.length > 0) return res.status(400).json({ status: false, msg: 'Lo sentimos el usuario esta registrado como propietario de este proyecto, no se puede agregar como colaborador' })

        const project_propietario = await Projects_Users.findAll({
            where: {
                projectId: projectCola.id,
                owner: 1
            },
            include: [
                {
                    model: Users,
                    attributes: ['id', 'full_name', 'email_user']
                }
            ]
        })

        if (project_propietario.length === 0) return res.status(400).json({ status: false, msg: 'Lo sentimos el proyecto no tiene un propietario' })

        await sendNotificationNewColaboradorProject(userCola, project_propietario[0].user.email_user, projectCola.title_project)

        await Notifications.create({
            content: `Te a pedido unirse en tu proyecto: ${projectCola.title_project}`,
            projectId: projectCola.id,
            owner_userId: project_propietario[0].user.id,
            collaborator_userId: userCola.id
        })

        res.status(200).json({ status: true, msg: "Solicitud enviada" })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ status: false, msg: "Error interno del servidor", error })
    }
}

const aceptarSolicitudColaborador = async (req, res) => {
    try {
        const { id } = req.params

        const notiBD = await Notifications.findByPk(id,{
            include: [
                {
                    model: Projects,
                },
                {
                    model: Users,
                    as: 'owner'
                },
                {
                    model: Users,
                    as: 'collaborator'
                }
            ]
        })

        console.log(notiBD)
        if (!notiBD) return res.status(400).json({ status: false, msg: 'No existe la notificación' })

        await Projects_Users.create({
            projectId: notiBD.projectId,
            userId: notiBD.collaborator_userId,
            owner: 0,
            permissionId: 2
        })

        await Notifications.destroy({
            where: {
                id: id
            }
        });

        await aceptRejectionNotificationNewColaboradorProject(notiBD.collaborator, notiBD.project.title_project, 'aceptado')

        res.status(200).json({ status: true, msg: "Aceptación de colaboración enviada" })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ status: false, msg: "Error interno del servidor", error })
    }
}

const rechazarSolicitudColaborador = async (req, res) => {
    try {
        const { id } = req.params

        const notiBD = await Notifications.findByPk(id,{
            include: [
                {
                    model: Projects,
                },
                {
                    model: Users,
                    as: 'owner'
                },
                {
                    model: Users,
                    as: 'collaborator'
                }
            ]
        })
        if (!notiBD) return res.status(400).json({ status: false, msg: 'No existe la notificación' })

        await Notifications.destroy({
            where: {
                id: id
            }
        });

        await aceptRejectionNotificationNewColaboradorProject(notiBD.collaborator, notiBD.project.title_project, 'rechazado')

        res.status(200).json({ status: true, msg: "Rechazo de colaboración enviada" })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ status: false, msg: "Error interno del servidor", error })
    }
}

const eliminarColaborador = async (req, res) => {
    try {
        const { colabId, projectId } = req.params

        const projectUsers = await Projects_Users.findOne({
            where: {
                projectId: projectId,
                userId: colabId,
                owner: 0
            }
        })

        if (!projectUsers) return res.status(400).json({ status: false, msg: 'No se encontro el colaborador asociado al proyecto' })

        await projectUsers.destroy()

        res.status(200).json({ status: true, msg: "Colaborador eliminado" })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ status: false, msg: "Error interno del servidor", error })
    }
}

const cambiarPermisos = async (req, res) => {
    try {
        const { colabId, projectId } = req.params
        const { permisoId } = req.body

        const projectUsers = await Projects_Users.findOne({
            where: {
                projectId: projectId,
                userId: colabId,
                owner: 0
            }
        })

        if (!projectUsers) return res.status(400).json({ status: false, msg: 'No se encontro el colaborador asociado al proyecto' })
        const permisoIdBD = await Permissions.findByPk(permisoId);
        if (!permisoIdBD) return res.status(400).json({ status: false, msg: 'No se encontro el permiso' })

        await Projects_Users.update(
            { permissionId: permisoId }, {
            where: {
                projectId: projectId,
                userId: colabId,
                owner: 0
            }
        })
        res.status(200).json({ status: true, msg: "Permiso actualizado" })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ status: false, msg: "Error interno del servidor", error })
    }
}

const crearNuevoPermiso = async (req, res) => {
    try {
        const { nombrePermiso, actualizar, visualizar, eliminar, crear } = req.body

        const parametrosRequeridos = [nombrePermiso, actualizar, visualizar, eliminar, crear];
        if (parametrosRequeridos.some(field => field === "" || field === undefined)) return res.status(400).json({ status: false, msg: 'Debe llenar todos los parametos requeridos' })

        if (typeof nombrePermiso !== 'string') {
            return res.status(400).json({ status: false, msg: 'El nombre del permiso debe ser una cadena de texto' });
        }

        if (nombrePermiso.length > MAX_TITLE_PERMISSION) {
            return res.status(400).json({ status: false, msg: 'El nombre debe tener menos de 32 caracteres' });
        }

        const permisos = [actualizar, visualizar, eliminar, crear];
        if (permisos.some(permiso => typeof permiso !== 'boolean')) {
            return res.status(400).json({ status: false, msg: 'Los permisos deben ser valores booleanos true para dar permiso y false para no dar el permiso' });
        }

        await Permissions.create({
            name_permission: nombrePermiso,
            read_project: visualizar,
            create_project: crear,
            update_project: actualizar,
            delete_project: eliminar
        })
        res.status(200).json({ status: true, msg: "Permiso nuevo creado" })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ status: false, msg: "Error interno del servidor", error })
    }
}

const listarNotificaciones = async (req, res) => {
    try {
        const notificaciones = await Notifications.findAll({
            where:{
                owner_userId: req.user.id
            },
            include: [
                {
                    model: Users,
                    as: 'owner',
                    attributes: ['id', 'full_name', 'email_user'],
                },
                {
                    model: Users,
                    as: 'collaborator',
                    attributes: ['id', 'full_name', 'email_user']
                },
                {
                    model: Projects,
                    attributes: ['id', 'title_project', 'description']
                }
            ]
        });
        res.status(200).json({ status: true, notificaciones })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ status: false, msg: "Error interno del servidor", error })
    }
}

export {
    colaborarProyecto,
    aceptarSolicitudColaborador,
    rechazarSolicitudColaborador,
    eliminarColaborador,
    cambiarPermisos,
    crearNuevoPermiso,
    listarNotificaciones,
}