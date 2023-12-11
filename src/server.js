import express from "express";
import dotenv from "dotenv";
import cors from "cors";

//Rutas
import routerUsers from "./routers/users_routes.js";
import routerProjects from "./routers/projects_routes.js";

const app = express();
dotenv.config();

app.set('port', process.env.PORT || 3000);
app.use(cors());

app.use(express.json())

//Rutas
app.use('/api', routerUsers);
app.use('/api', routerProjects);
// Endpoints

app.get('/',(req,res)=>{
    res.json({info: 'Bienvenido a la API de gestion de proyectos'})
})

export default app;