import Sequelize from 'sequelize';
import dotenv from 'dotenv'

dotenv.config()

let sequelize;
if (process.env.PRODUCCION === 'true') {
  console.log("Base de produccion")
  sequelize = new Sequelize({
    host: process.env.HOST,
    dialect: process.env.DIALECTDB,
    port: process.env.PORTDB,
    username: process.env.USERNAMEDB,
    password: process.env.PASSWORDDB,
    database: process.env.DATABASE,
    ssl: process.env.SSL,
    dialectOptions: {
      ssl: {
        require: true
      }
    },
    logging: false,
    timezone: 'America/Guayaquil',
  });
} else {
  console.log("Base de desarrollo")
  sequelize = new Sequelize({
    host: process.env.HOST,
    dialect: process.env.DIALECTDB,
    port: process.env.PORTDB,
    username: process.env.USERNAMEDB,
    password: process.env.PASSWORDDB,
    timezone: 'America/Guayaquil',
  });
}

sequelize.authenticate()
  .then(() => {
    console.log('Conexión establecida con éxito.');
  })
  .catch((error) => {
    console.error('No se pudo conectar a la base de datos:', error);
  });

sequelize.sync()
  .then(() => {
    console.log('Modelos sincronizados con la base de datos.');
  })
  .catch((error) => {
    console.error('Error al sincronizar modelos con la base de datos:', error);
  });

export default sequelize