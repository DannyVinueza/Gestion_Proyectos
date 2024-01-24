<p align="center"><a href="https://gestion-proyectos-gamma.vercel.app/" target="_blank"><img src="https://i.postimg.cc/RZd9RWzB/imagen-2024-01-23-113622114.png" width="400" alt="Project Logo"></a></p>

[![Node.js](https://img.shields.io/badge/Node.js-%23339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/) [![Express](https://img.shields.io/badge/Express-%23000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/) [![JavaScript](https://img.shields.io/badge/JavaScript-%23F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript) [![Nodemailer](https://img.shields.io/badge/Nodemailer-%235678CC?style=for-the-badge&logo=nodemailer&logoColor=white)](https://nodemailer.com/) [![Mocha](https://img.shields.io/badge/Mocha-%238D6748?style=for-the-badge&logo=mocha&logoColor=white)](https://mochajs.org/) [![Chai](https://img.shields.io/badge/Chai-%23A22852?style=for-the-badge&logo=chai&logoColor=white)](https://www.chaijs.com/) [![npm](https://img.shields.io/badge/npm-%23000000?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/) [![Nodemon](https://img.shields.io/badge/Nodemon-%237DC8FF?style=for-the-badge&logo=nodemon&logoColor=white)](https://nodemon.io/) [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%x-blue?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/) [![Sequelize](https://img.shields.io/badge/Sequelize-%236E44B0?style=for-the-badge&logo=sequelize&logoColor=white)](https://sequelize.org/)

# Project Core

This project has been developed focusing on users being able to share and create projects.

## Authors 🪬

- [@Danny Vinueza](https://github.com/DannyVinueza)
 
## Tech Stack 🧩👥

**Server:** Node, Express, PostgreSQL, Vercel

**Client:** React JS, Vite, React Router Dom, Material UI Core, React Testing Library [Code Here.](https://github.com/ItsgabrielJT/project-core-front)

## Documentation 📄

[Documentation link](https://documenter.getpostman.com/view/26764278/2s9YkjB3ck#0d54c1ab-ef9a-437e-ae6d-774abad15bb8)

## Environment Requirements (Backend)

Make sure you have the appropriate version of Node.js installed to run the backend server. It is recommended to use Node.js version 18.17.1

## PostgreSQL Database Configuration

The backend server uses PostgreSQL as the database. Before running the project, make sure to provide the necessary credentials in the .env file specifically in the values:

- HOST
- DIALECTDB
- PORTDB
- USERNAMEDB
- PASSWORDDB
- DATABASE
- SSL
- PRODUCCION = TRUE

> For a local database the following values ​​are needed:
> - HOST
> - DIALECTDB
> - PORTDB
> - USERNAMEDB
> - PASSWORDDB
> - PRODUCCION = FALSE

## Install the project locally ⚠️⚠️⚠️⚠️


Clone the project

```bash
  git clone https://github.com/DannyVinueza/Gestion_Proyectos.git
```

Install dependencies

```bash
  npm install
```

Set the environment variables in the *.env* file as shown in the *.env.example* file

Start the server

```bash
  npm run dev
```

## Desploy on vercel 🚀🧩

- Cree el archivo vercel.json en el código fuente (raíz del proyecto) e ingrese este código.

```json
  {
    "name":"gestion-proyectos",
    "version": 2,
    "builds": [
        {
            "src": "src/index.js",
            "use": "@vercel/node"
        }
    ],
    "routes": [
        {
            "src": "/(.*)",
            "dest": "src/index.js"
        }
    ]
  }
```

> This code will help vercel identify which is the main file for the build and start with the paths.

- Upload the changes to GitHub, then join the project repository with the respective vercel account
Follow the necessary steps:
- Import the repository to vercel
- Write the name of the project in 'Project name'
- Type *./* in 'Root Directory'
- Write *npm start* in 'Build Command'
- Write *npm install* in 'Install Command'
- Write environment variables for production
- And finally click on deploy

[Link deploy (Base URL)](https://gestion-proyectos-gamma.vercel.app/)

## License

This project is under the [MIT license](https://opensource.org/licenses/MIT).