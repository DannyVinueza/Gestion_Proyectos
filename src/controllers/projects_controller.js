import Projects from "../models/Projects.js";
import sequelize from "../database.js";

const MAX_TITLE = 20;
const MAX_STATE = 1;
const MAX_DESCRIPTION = 200;
const MAX_LINK_IMAGEN = 160;
const MAX_GENERAL_OBJETIVE = 1024;
const MAX_SPECIFIC_OBJECT = 160;
const MAX_SCOPE = 2000;
const MAX_BIBLIOGRAPHIC = 2000;

const listarProyectos = async (req, res) => {
    try {
        const proyectos = await Projects.findAll();
        const proyectosFormateados = proyectos.map(proyecto => {
            return {
                ...proyecto.get(),
                general_objetive: proyecto.general_objetive.split('| ').filter(Boolean),
                specific_object: proyecto.specific_object.split('| ').filter(Boolean),
                bibliographic_references: proyecto.bibliographic_references.split('| ').filter(Boolean)
            };
        });
        res.status(200).json({ status: true, proyectos: proyectosFormateados })
    } catch (error) {
        res.status(500).json({ status: false, msg: "Error interno del servidor", error })
    }
}

const listarProyecto = async (req, res) => {
    try {
        const { id } = req.params

        const projBDD = await Projects.findByPk(id)
        if (!projBDD) return res.status(400).json({ status: false, msg: 'El proyecto no se encuentra' })
        const proyectoFormateado = {
            ...projBDD.get(),
            general_objetive: projBDD.general_objetive.split('| ').filter(Boolean),
            specific_object: projBDD.specific_object.split('| ').filter(Boolean),
            bibliographic_references: projBDD.bibliographic_references.split('| ').filter(Boolean)
        };
        res.status(200).json({ status: true, proyecto: proyectoFormateado })
    } catch (error) {
        res.status(500).json({ status: false, msg: "Error interno del servidor", error })
    }
}

const crearProyecto = async (req, res) => {
    try {
        const { titulo, estado, descripcion, link_imagen, objetivos_generales,
            objetivos_especificos, alcance, referencias_bibliograficas } = req.body

        const parametrosRequeridos = [titulo, estado, descripcion, link_imagen, objetivos_generales,
            objetivos_especificos, alcance, referencias_bibliograficas];
        if (parametrosRequeridos.some(field => field === "" || field === undefined)) return res.status(400).json({ status: false, msg: 'Debe llenar todos los parametos requeridos' })

        if (titulo.length > MAX_TITLE ||
            estado.toString().length > MAX_STATE ||
            descripcion.length > MAX_DESCRIPTION ||
            link_imagen.length > MAX_LINK_IMAGEN ||
            objetivos_generales.length > MAX_GENERAL_OBJETIVE ||
            objetivos_especificos.length > MAX_SPECIFIC_OBJECT ||
            alcance.length > MAX_SCOPE ||
            referencias_bibliograficas.length > MAX_BIBLIOGRAPHIC) return res.status(400).json({ status: false, msg: 'Los datos exceden la longitud máxima permitida' });

        if (!Array.isArray(objetivos_generales) || !objetivos_generales.length ||
            !Array.isArray(objetivos_especificos) || !objetivos_especificos.length ||
            !Array.isArray(referencias_bibliograficas) || !referencias_bibliograficas.length) {
            return res.status(400).json({ status: false, msg: 'Las listas no pueden estar vacías' });
        }

        const objetivo_general = Array.isArray(objetivos_generales) ? objetivos_generales.join("| ") : objetivos_generales;
        const objetivo_especifico = Array.isArray(objetivos_especificos) ? objetivos_especificos.join("| ") : objetivos_especificos;
        const referencias_biblio = Array.isArray(referencias_bibliograficas) ? referencias_bibliograficas.join("| ") : referencias_bibliograficas;


        await Projects.create({
            title_project: titulo,
            state: estado,
            description: descripcion,
            link_image: link_imagen,
            general_objetive: objetivo_general,
            specific_object: objetivo_especifico,
            scope: alcance,
            bibliographic_references: referencias_biblio
        })
        res.status(200).json({ status: true, msg: 'Proyecto creado' })
    } catch (error) {
        res.status(500).json({ status: false, msg: "Error interno del servidor", error })
    }
}

const actualizarProyecto = async (req, res) => {
    try {
        const { id } = req.params
        const { titulo, estado, descripcion, link_imagen, objetivos_generales,
            objetivos_especificos, alcance, referencias_bibliograficas } = req.body

        const parametrosRequeridos = [titulo, estado, descripcion, link_imagen, objetivos_generales,
            objetivos_especificos, alcance, referencias_bibliograficas];
        if (parametrosRequeridos.some(field => field === undefined)) return res.status(400).json({ status: false, msg: 'Debe llenar todos los parametos requeridos' })

        if (titulo.length > MAX_TITLE ||
            estado.toString().length > MAX_STATE ||
            descripcion.length > MAX_DESCRIPTION ||
            link_imagen.length > MAX_LINK_IMAGEN ||
            objetivos_generales.length > MAX_GENERAL_OBJETIVE ||
            objetivos_especificos.length > MAX_SPECIFIC_OBJECT ||
            alcance.length > MAX_SCOPE ||
            referencias_bibliograficas.length > MAX_BIBLIOGRAPHIC) return res.status(400).json({ status: false, msg: 'Los datos exceden la longitud máxima permitida' });

        if (!Array.isArray(objetivos_generales) || !objetivos_generales.length ||
            !Array.isArray(objetivos_especificos) || !objetivos_especificos.length ||
            !Array.isArray(referencias_bibliograficas) || !referencias_bibliograficas.length) {
            return res.status(400).json({ status: false, msg: 'Las listas no pueden estar vacías' });
        }

        const objetivo_general = Array.isArray(objetivos_generales) ? objetivos_generales.join("| ") : objetivos_generales;
        const objetivo_especifico = Array.isArray(objetivos_especificos) ? objetivos_especificos.join("| ") : objetivos_especificos;
        const referencias_biblio = Array.isArray(referencias_bibliograficas) ? referencias_bibliograficas.join("| ") : referencias_bibliograficas;


        const projBDD = await Projects.findByPk(id)
        if (!projBDD) return res.status(404).json({ status: false, msg: 'Lo sentimos no existe el proyecto' })

        await projBDD.update({
            title_project: titulo || projBDD.title_project,
            state: estado || projBDD.state,
            description: descripcion || projBDD.descripcion,
            link_image: link_imagen || projBDD.link_image,
            general_objetive: objetivo_general || projBDD.general_objetive,
            specific_object: objetivo_especifico || projBDD.specific_object,
            scope: alcance || projBDD.scope,
            bibliographic_references: referencias_biblio || projBDD.bibliographic_references
        })

        return res.status(200).json({ status: true, msg: 'Proyecto actualizado' })
    } catch (error) {
        res.status(500).json({ status: false, msg: "Error interno del servidor", error })
    }

}

const eliminarProyecto = async (req, res) => {
    try {
        const { id } = req.params
        const projBDD = await Projects.findByPk(id)

        if (!projBDD) return res.status(400).json({ status: false, msg: 'El proyecto no se encuentra registrado' })

        await projBDD.destroy()
        res.status(200).json({ status: true, msg: 'Se elimino el proyecto' })
    } catch (error) {
        res.status(500).json({ status: false, msg: "Error interno del servidor", error })
    }
}

export {
    listarProyectos,
    listarProyecto,
    crearProyecto,
    actualizarProyecto,
    eliminarProyecto
}