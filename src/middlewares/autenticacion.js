import jwt from 'jsonwebtoken';
import Usuarios from '../models/Usuarios.js';

const verAutenticacion = async (req, res, next)=>{
    if(!req.headers.authorization) return res.status(404).json({msg:'Debes proporcionar un token'})
    const {authorization} = req.headers
    try{
        const { id } = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET)
        req.user = await Usuarios.findByPk(id,{
            attributes:{exclude:['password']},
        })
        next()
    }catch(error){
        const e = new Error("Fomato del token invalido")
        return res.status(404).json({msg:e.message})
    }
}

export default verAutenticacion;