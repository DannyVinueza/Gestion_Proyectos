import { expect } from 'chai';
import { 
    registro,
    actualizarPerfil,
    login
} from '../controllers/users_controller.js';


describe('Registrar', function () {
    it('Registrar usuario', async function () {
        // crea un objeto válido para pasar a la función
        let req = {
            body: {
                email: "gaxajit641@ikuromi.com",
                contrasenia: "123456789",
                nombres: "Danny Vinueza",
                universidad: "EPN",
                carrera: "Desarrollo de Software",
                numero_celular: "593998784578",
                ocupacion: "Estudiante",
                link_imagen_perfil: ""
            }
        };
        // crea un objeto res con una función json para capturar la respuesta de la función
        let res = {
            status: function (code) {
                // usa expect de chai para verificar que el código de estado sea el esperado
                expect(code).to.equal(200);
                // devuelve el mismo objeto res para poder encadenar la función json
                return this;
            },
            json: function (data) {
                // usa expect de chai para verificar que el dato sea el esperado
                expect(data).to.deep.equal({ status: true, msg: "Usuario registrado" });
            }
        };
        // llama a la función con los objetos req y res
        await registro(req, res);
    });
});

describe('Actualizar perfil', function () {
    it('Actualizar perfil', async function () {
        //Creamos un objeto valido para pasar a la funcion
        let req = {
            params: {
                id: '15'
            },
            body: {
                universidad: "EPN",
                carrera: "Ingenieria en Software",
                numero_celular: "593923599999",
                link_imagen_perfil: ""
            }
        }
        // Creamos un objeto res con una funcion json para capturar la respuesta de la funcion
        let res = {
            status: function(code){
                //Verificamos el codigo de estado con expect de chai
                expect(code).to.equal(200)
                return this;
            },
            json: function(data){
                //Verificamos que el dato sea el esperado con expect de chai
                expect(data).to.deep.equal({status:true, msg: 'Perfil actualizado'})
            }
        };
        await actualizarPerfil(req, res);
    });
});

describe ('Iniciar sesión', function () {
    it ('Iniciar sesión', async function (){
        // Creamos el objeto valido para pasar a la funcion
        let req = {
            body:{
                email:"gaxajit641@ikuromi.com",
                contrasenia:"123456789"
            }
        }

        // Creammos el objeto res con una funcion json para capturar la respuesta de la funcion
        let res = {
            status: function(code){
                //Verificamos el codigo de estado con expect de chai
                expect(code).to.equal(200)
                return this;
            },
            json: function(data){
                //Verficamos que el dato sea el esperado con expect de chai
                expect(data).to.have.all.keys('status', 'token', 'id', 'nombreCompleto', 'universidad', 'celular', 'linkImagen', 'carrera', 'ocupacion')

                expect(data.status).to.be.true
                expect(data.token).to.be.a('string')
                expect(data.id).to.be.a('number')
                expect(data.nombreCompleto).to.be.a('string')
                expect(data.universidad).to.be.a('string')
                expect(data.celular).to.be.a('string')
                expect(data.linkImagen).to.be.a('string')
                expect(data.carrera).to.be.a('string')
                expect(data.ocupacion).to.be.a('string')
            }
        }
        await login(req, res);
    });
});