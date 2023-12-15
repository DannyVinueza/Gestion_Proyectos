import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import Projects from "./Projects.js"; // Asegúrate de importar el modelo de Projects
import Users from "./Users.js"; // Asegúrate de importar el modelo de Users


const Projects_Users = sequelize.define('projects_users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Projects,
            key: 'id', // Reemplaza 'id' con el nombre del campo de la tabla Projects
        },
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Users,
            key: 'id', // Reemplaza 'id' con el nombre del campo de la tabla Users
        },
    },
    owner: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

}, {
    tableName: 'projects_users',
    timestamps: false,
})

Projects_Users.belongsTo(Projects, { foreignKey: 'projectId' });
Projects_Users.belongsTo(Users, { foreignKey: 'userId' });
Projects.belongsToMany(Users, { through: Projects_Users, foreignKey: 'projectId', onDelete: 'CASCADE' });
Users.belongsToMany(Projects, { through: Projects_Users, foreignKey: 'userId', onDelete: 'CASCADE' });


export default Projects_Users;