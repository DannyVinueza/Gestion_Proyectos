import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import Projects from "./Projects.js";
import Users from "./Users.js";;


const Notifications = sequelize.define('notifications', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    content: {
        type: DataTypes.STRING(2000),
        allowNull: false
    },
    owner_notification: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    tableName: 'notifications',
    timestamps: true,
});

Notifications.belongsTo(Projects, { foreignKey: 'projectId', onDelete: 'CASCADE' });
Notifications.belongsTo(Users, { as: 'owner', foreignKey: 'owner_userId', onDelete: 'CASCADE' });
Notifications.belongsTo(Users, { as: 'collaborator', foreignKey: 'collaborator_userId', onDelete: 'CASCADE' });

export default Notifications;