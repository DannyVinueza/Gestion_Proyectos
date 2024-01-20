import { expect } from 'chai';
import {
    crearProyecto, listarProyectosColaboracion
} from '../controllers/projects_controller.js'
import {
    cambiarPermisos,
    colaborarProyectoAniadir,
    listarNotificaciones,
    verPermisoColaborador
} from '../controllers/collaborators_controller.js';

describe('Crear un proyecto', function () {
    it('Crear un proyecto', async function () {
        // Creamos un objeto valido para enviarle a la funcion
        let req = {
            body: {
                titulo: "Titulo de prueba",
                estado: 2,
                descripcion: "Este es un proyecto para realizar una prueba",
                link_imagen: "",
                objetivos_generales: ["Objetivo de prueba", "Obejtivo de prueba"],
                objetivos_especificos: ["Obejtivo especifico de prubea", "Objetivo especifico de prueba2"],
                alcance: "El alcance es escrito para una prueba",
                referencias_bibliograficas: ["Es una prueba", "Segunda bibliografia de prueba", "Tercera bibliografia de prueba"]
            },
            user: {
                id: 15
            }
        }

        // Creamos un objeto res con una funcion json para capturar la respuesta de la funcion
        let res = {
            status: function (code){
                //Usamos expect de chai para verificar el codigo de estado
                expect(code).to.equal(200)
                return this;
            },
            json: function (data){
                //Usamos expect de chai para verificar que el dato o datos sean los esperados
                expect(data).to.deep.equal({status:true, msg:'Proyecto creado'})
            }
        }

        await crearProyecto(req,res);
    })
});

describe('Colaborar proyecto', function(){
    it('Envia una solicitud para que el usuario sea colaborador de un proyecto', async function(){
        // Creamos un objeto valido para enviarle a la funcion
        let req={
            body:{
                id_proyecto:12,
                id_usuario_colaborador: 15
            },
            user:{
                id:15
            }
        }

        // Creamos un objeto res con una funcion json para capturar la respuesta de la funcion
        let res={
            status: function (code){
                //Usamos expect de chai para verificar el codigo de estado
                expect(code).to.equal(200)
                return this;
            },
            json: function(data){
                //Usamos expect de chai para verificar que el dato o datos sean los esperados
                expect(data).to.deep.equal({status: true, msg:'Solicitud enviada'})
            }
        }

        await colaborarProyectoAniadir(req, res);
    });
});

describe ('Cambiar permisos', function(){
    it('Cambiar los permisos de un colaborador que tiene sobre el proyecto', async function(){
        // Creamos un objeto valido para enviarle a la funcion
        let req = {
            params:{
                colabId:15,
                projectId:12
            },
            body:{
                actualizar:true,
                eliminar:false
            }
        }

        // Creamos un objeto res con una funcion json para capturar la respuesta de la funcion
        let res={
            status: function(code){
                //Usamos expect de chai para verificar el codigo de estado
                expect(code).to.equal(200)
                return this;
            },
            json: function(data){
                //Usamos expect de chai para verificar que el dato o datos sean los esperados
                expect(data).to.deep.equal({status:true, msg:'Permiso actualizado'})
            }
        }
        await cambiarPermisos(req, res)
    });
});

describe('Listar las notificaciones', function () {
    it('Listar las notificaciones del usuario', async function () {
        // Creamos un objeto valido para enviarle a la funcion
        let req = {
            user: {
                id: 15
            }
        }

        // Creamos un objeto res con una funcion json para capturar la respuesta de la funcion
        let res = {
            status: function (code) {
                //Usamos expect de chai para verificar el codigo de estado
                expect(code).to.equal(200)
                return this;
            },
            json: function (data) {
                //Usamos expect de chai para verificar que el dato o datos sean los esperados
                expect(data).to.have.all.keys('status', 'notificaciones');
                expect(data.status).to.be.true;
                expect(data.notificaciones).to.be.an('array');
            }
        }
        await listarNotificaciones(req, res);
    });
});

describe('Listar los proyectos en colaboracion', function () {
    it('Lista los proyectos en colaboracion', async function () {
        // Creamos un objeto valido para enviarle a la funcion
        let req = {
            user: {
                id: 15
            }
        }

        // Creamos un objeto res con una funcion json para capturar la respuesta de la funcion
        let res = {
            status: function (code) {
                //Usamos expect de chai para verificar el codigo de estado
                expect(code).to.equal(200)
                return this;
            },
            json: function (data) {
                //Usamos expect de chai para verificar que el dato o datos sean los esperados
                expect(data).to.have.all.keys('status', 'proyectos_colaboracion');
                expect(data.status).to.be.true;
                expect(data.proyectos_colaboracion).to.be.an('array');
                // asume que hay al menos un proyecto de colaboración en la base de datos para el usuario
                expect(data.proyectos_colaboracion).to.have.lengthOf.above(0);
                // verifica que cada proyecto tenga la estructura y el tipo esperados
                data.proyectos_colaboracion.forEach(proyecto => {
                    expect(proyecto).to.have.all.keys('id', 'title_project', 'state', 'createdAt', 'updatedAt', 'propietario');
                    expect(proyecto.id).to.be.a('number');
                    expect(proyecto.title_project).to.be.a('string');
                    expect(proyecto.state).to.be.a('number');
                    expect(proyecto.createdAt).to.be.a('date');
                    expect(proyecto.updatedAt).to.be.a('date');
                    expect(proyecto.propietario).to.be.an('object');
                    expect(proyecto.propietario).to.have.all.keys('id', 'projectId', 'user');
                    expect(proyecto.propietario.id).to.be.a('number');
                    expect(proyecto.propietario.projectId).to.be.a('number');
                    expect(proyecto.propietario.user).to.be.an('object');
                    expect(proyecto.propietario.user.id).to.be.a('number');
                    expect(proyecto.propietario.user.full_name).to.be.a('string');
                    expect(proyecto.propietario.user.link_image).to.be.a('string');
                    expect(proyecto.propietario.user.occupation).to.be.a('string');
                });
            }
        }
        await listarProyectosColaboracion(req, res);
    });
});

describe('Ver permisos', function () {
    it('Ver los permisos de un usuario como colaborador de un proyecto', async function () {
        // Creamos un objeto valido para enviarle a la funcion
        let req = {
            params: {
                colabId: 15,
                projectId: 12
            }
        }

        // Creamos un objeto res con una funcion json para capturar la respuesta de la funcion
        let res = {
            status: function (code) {
                //Usamos expect de chai para verificar el codigo de estado
                expect(code).to.equal(200)
                return this;
            },
            json: function (data) {
                //Usamos expect de chai para verificar que el dato o datos sean los esperados
                expect(data).to.have.all.keys('status', 'permiso');
                expect(data.status).to.be.true;
                expect(data.permiso).to.be.an('object');
                //Verificamos que tenga la estructura esperada
                expect(data.permiso.permissionId).to.be.a('number');
                expect(data.permiso.permission).to.be.an('object');
                expect(data.permiso.permission.update_project).to.be.a('boolean');
                expect(data.permiso.permission.delete_project).to.be.a('boolean');
                expect(data.permiso.user).to.be.an('object');
                expect(data.permiso.user.id).to.be.a('number');
                expect(data.permiso.user.full_name).to.be.a('string');
            }
        }
        await verPermisoColaborador(req, res);
    });
});