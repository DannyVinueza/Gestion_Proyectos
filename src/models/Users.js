import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import bcrypt from "bcryptjs";

const Users = sequelize.define('users',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    email_user:{
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true,
    },
    password_user:{
        type: DataTypes.STRING(160),
        allowNull: false,
    },
    full_name:{
        type: DataTypes.STRING(64),
        allowNull: false,
    },
    university_name:{
        type: DataTypes.STRING(64),
        allowNull: false
    },
    cellphone_number:{
        type: DataTypes.STRING(20),
        allowNull: false
    },
    link_image:{
        type: DataTypes.STRING(160),
        allowNull: false
    },
    career:{
        type: DataTypes.STRING(150),
        allowNull: false
    },
    occupation:{
        type: DataTypes.STRING(32),
        allowNull: false
    },
    token:{
        type: DataTypes.STRING(120),
        allowNull: true
    },
    confirmarEmail:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
},{
    tableName: 'users',
    timestamps: false,
})

// Encriptacion de la password
Users.prototype.encrypPassword = async function(password){
    try{
        const salt = await bcrypt.genSalt(5);
        const passwordEncryp = await bcrypt.hash(password, salt);
        return passwordEncryp;
    }catch(error){
        return "error"
    }
    
}

//Verificar si el password ingresado es el mismo de la BD desencriptando
Users.prototype.matchPassword = async function(password){
    const response = await bcrypt.compare(password, this.password_user);
    return response;
}

// Generar token
Users.prototype.crearToken = function(){
    const tokenGenerado = Math.random().toString(36).slice(2);
    this.token = tokenGenerado;
    return tokenGenerado;
}

export default Users;