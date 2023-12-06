import app from './server.js';
import sequelize from './database.js';

app.listen(app.get('port'),()=>{
    console.log(`Servidor encendido en el puerto: ${app.get('port')}`);
})