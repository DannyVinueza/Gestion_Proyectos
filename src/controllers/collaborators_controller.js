import Projects_Users from "../models/Projects_Users.js";
import Permissions from "../models/Permissions.js";
import Users from "../models/Users.js";
import Projects from "../models/Projects.js";
import {
    sendNotificationNewColaboradorProject,
    sendNotificationNewColaboradorProjectAdd,
    aceptRejectionNotificationNewColaboradorProject,
    aceptRejectionNotificationNewColaboradorProjectAdd
} from "../config/nodemailer.js";
import Notifications from "../models/Notifications.js";
import { Op, Sequelize } from 'sequelize';

const MAX_TITLE_PERMISSION = 32;

const colaborarProyecto = async (req, res) => {
    try {
        const { id_proyecto } = req.body

        const userCola = await Users.findByPk(req.user.id)
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
            collaborator_userId: userCola.id,
            owner_notification: project_propietario[0].user.id
        })

        res.status(200).json({ status: true, msg: "Solicitud enviada" })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ status: false, msg: "Error interno del servidor", error })
    }
}

const colaborarProyectoAniadir = async (req, res) => {
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
                    attributes: ['id', 'full_name', 'email_user', 'occupation']
                }
            ]
        })

        if (project_propietario.length === 0) return res.status(400).json({ status: false, msg: 'Lo sentimos el proyecto no tiene un propietario' })

        await Notifications.create({
            content: `Ha solicitado que se una en el proyecto: ${projectCola.title_project}`,
            projectId: projectCola.id,
            owner_userId: project_propietario[0].user.id,
            collaborator_userId: userCola.id,
            owner_notification: userCola.id
        })

        await sendNotificationNewColaboradorProjectAdd(userCola, project_propietario[0].user, projectCola.title_project)

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

        const notiBD = await Notifications.findByPk(id, {
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

        const permissionIdBD = await verificarOCrearPermiso({
            read_project: true,
            create_project: true,
            update_project: true,
            delete_project: true
        });

        await Projects_Users.create({
            projectId: notiBD.projectId,
            userId: notiBD.collaborator_userId,
            owner: 0,
            permissionId: permissionIdBD
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

const aceptarSolicitudColaboradorAniadir = async (req, res) => {
    try {
        const { id } = req.params

        const notiBD = await Notifications.findByPk(id, {
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

        const permissionIdBD = await verificarOCrearPermiso({
            read_project: true,
            create_project: true,
            update_project: true,
            delete_project: true
        });

        await Projects_Users.create({
            projectId: notiBD.projectId,
            userId: notiBD.collaborator_userId,
            owner: 0,
            permissionId: permissionIdBD
        })

        await Notifications.destroy({
            where: {
                id: id
            }
        });

        await aceptRejectionNotificationNewColaboradorProjectAdd(notiBD.collaborator, notiBD.project.title_project, 'Ha aceptado ser conlaborador', notiBD.owner.email_user)

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

        const notiBD = await Notifications.findByPk(id, {
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

const rechazarSolicitudColaboradorAniadir = async (req, res) => {
    try {
        const { id } = req.params

        const notiBD = await Notifications.findByPk(id, {
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

        await aceptRejectionNotificationNewColaboradorProjectAdd(notiBD.collaborator, notiBD.project.title_project, 'No ha aceptado ser conlaborador', notiBD.owner.email_user)

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

        const { actualizar, eliminar } = req.body
        const parametrosRequeridos = [actualizar, eliminar];
        if (parametrosRequeridos.some(field => field === "" || field === undefined)) return res.status(400).json({ status: false, msg: 'Debe llenar todos los parametos requeridos' })

        const permisos = [actualizar, eliminar];
        if (permisos.some(permiso => typeof permiso !== 'boolean')) {
            return res.status(400).json({ status: false, msg: 'Los permisos deben ser valores booleanos true para dar permiso y false para no dar el permiso' });
        }

        const projectUsers = await Projects_Users.findOne({
            where: {
                projectId: projectId,
                userId: colabId,
                owner: 0
            }
        })

        if (!projectUsers) return res.status(400).json({ status: false, msg: 'No se encontro el colaborador asociado al proyecto' })

        const permissionIdBD = await verificarOCrearPermiso({
            read_project: true,
            create_project: true,
            update_project: actualizar,
            delete_project: eliminar,
        });

        await projectUsers.update({ permissionId: permissionIdBD })
        res.status(200).json({ status: true, msg: "Permiso actualizado" })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ status: false, msg: "Error interno del servidor", error })
    }
}

const listarNotificaciones = async (req, res) => {
    try {
        const notificaciones = await Notifications.findAll({
            where: {
                owner_notification: req.user.id
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

        const notificacionesFormateadas = notificaciones.map(notificacion => {
            let tipo;
            if (notificacion.owner_userId === notificacion.owner_notification) {
                tipo = 'peticion';
            } else if (notificacion.collaborator_userId === notificacion.owner_notification) {
                tipo = 'invitacion';
            }

            return {
                ...notificacion.get(),
                tipo
            };
        });
        res.status(200).json({ status: true, notificaciones: notificacionesFormateadas })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ status: false, msg: "Error interno del servidor", error })
    }
}

const listarPemrisos = async (req, res) => {
    try {
        const permisosBD = await Permissions.findAll();
        res.status(200).json({ status: true, permisos: permisosBD })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ status: false, msg: "Error interno del servidor", error })
    }
}

const buscarProyectoOUser = async (req, res) => {
    try {
        const { busqueda } = req.body;
        const busquedaSE = busqueda.trim();

        if (!busquedaSE) {
            return res.status(400).json({ status: false, message: 'Ingresa un término de búsqueda válido' });
        }

        const parametrosRequeridos = [busqueda];
        if (parametrosRequeridos.some(field => field === undefined)) return res.status(400).json({ status: false, msg: 'Debe enviar el parametro busqueda' })

        const usersResult = await Users.findAll({
            where: {
                full_name: {
                    [Op.iLike]: `%${busquedaSE}%`
                }
            },
            attributes: ['id', 'full_name', 'occupation']
        });

        const projectsResult = await Projects.findAll({
            where: {
                title_project: {
                    [Op.iLike]: `%${busquedaSE}%`
                }
            },
            attributes: ['id', 'title_project', 'state']
        });

        res.status(200).json({ status: true, users: usersResult, projects: projectsResult });
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: false, msg: "Error interno del servidor", error })
    }
}


const estadisticasProyectos = async (req, res) => {
    try {
        const userId = req.user.id;

        const resultados = await Projects_Users.findAll({
            where: {
                userId: userId,
                owner: 1
            },
            include: [{
                model: Projects,
                attributes: ['state']
            }]
        });

        const proyectosPorEstado = {
            1: 0,
            2: 0,
            3: 0,
            4: 0
        };

        resultados.forEach((row) => {
            const estadoProyecto = row.project.state;
            proyectosPorEstado[estadoProyecto]++;
        });

        const proyectosResult = Object.keys(proyectosPorEstado).map((key) => ({
            estado: parseInt(key),
            proyectos: proyectosPorEstado[key]
        }));

        res.status(200).json({ status: true, proyectos: proyectosResult });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, msg: "Error interno del servidor", error });
    }
};

const verPermisoColaborador = async (req, res) => {
    try {
        const { colabId, projectId } = req.params
        const projectUsers = await Projects_Users.findOne({
            where: {
                projectId: projectId,
                userId: colabId,
                owner: 0
            },
            include:[
                {
                    model: Permissions,
                    attributes: ['update_project', 'delete_project']
                },
                {
                    model: Users,
                    attributes: ['id', 'full_name']
                }
            ],
            attributes: ['permissionId']
        })

        if (!projectUsers) return res.status(400).json({ status: false, msg: 'No se encontro el colaborador asociado al proyecto' })

        res.status(200).json({ status: true, permiso: projectUsers });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, msg: "Error interno del servidor", error });
    }
}



const verificarOCrearPermiso = async (permissionData) => {
    try {
        const { read_project, create_project, update_project, delete_project } = permissionData;

        // Buscar un permiso existente con los mismos valores
        const existingPermission = await Permissions.findOne({
            where: {
                read_project,
                create_project,
                update_project,
                delete_project,
            }
        });

        if (existingPermission) {
            return existingPermission.id; // Devuelve el ID del permiso existente
        } else {
            // Si no existe, crea un nuevo permiso
            const newPermission = await Permissions.create({
                read_project,
                create_project,
                update_project,
                delete_project,
            });
            return newPermission.id; // Devuelve el ID del nuevo permiso creado
        }
    } catch (error) {
        throw new Error('Error al verificar o crear el permiso', error);
    }
};

export {
    colaborarProyecto,
    colaborarProyectoAniadir,
    aceptarSolicitudColaborador,
    aceptarSolicitudColaboradorAniadir,
    rechazarSolicitudColaborador,
    rechazarSolicitudColaboradorAniadir,
    eliminarColaborador,
    cambiarPermisos,
    listarNotificaciones,
    listarPemrisos,
    buscarProyectoOUser,
    estadisticasProyectos,
    verPermisoColaborador
}