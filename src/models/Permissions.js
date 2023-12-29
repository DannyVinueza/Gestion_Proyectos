import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Permissions = sequelize.define('permissions', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    read_project: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    create_project: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    update_project: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    delete_project: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
}, {
    tableName: 'permissions',
    timestamps: true,
})

export default Permissions;