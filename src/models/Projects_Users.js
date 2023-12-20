import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import Projects from "./Projects.js";
import Users from "./Users.js";
import Permissions from "./Permissions.js";


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
    permissionId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:Permissions,
            key: 'id'
        }
    }
}, {
    tableName: 'projects_users',
    timestamps: true,
})

Projects_Users.belongsTo(Projects, { foreignKey: 'projectId' });
Projects_Users.belongsTo(Users, { foreignKey: 'userId' });
Projects_Users.belongsTo(Permissions, {foreignKey: 'permissionId'});
Projects.belongsToMany(Users, { through: Projects_Users, foreignKey: 'projectId', onDelete: 'CASCADE' });
Users.belongsToMany(Projects, { through: Projects_Users, foreignKey: 'userId', onDelete: 'CASCADE' });

export default Projects_Users;