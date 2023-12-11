import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Projects = sequelize.define('projects',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    title_project:{
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    state:{
        type: DataTypes.INTEGER,
        allowNull:false,
    },
    description:{
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    link_image:{
        type: DataTypes.STRING(160),
        allowNull: false
    },
    general_objetive:{
        type: DataTypes.STRING(1024),
        allowNull: false,
    },
    specific_object:{
        type: DataTypes.STRING(1024),
        allowNull: false,
    },
    scope:{
        type: DataTypes.STRING(2000),
        allowNull: false,
    },
    bibliographic_references:{
        type: DataTypes.STRING(2000),
        allowNull: false,
    }
},{
    tableName: 'projects',
    timestamps: false,
})

export default Projects;