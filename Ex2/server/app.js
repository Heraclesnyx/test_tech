import express from 'express';

import sequelize from './utils/mysql.js';

import router from './routes/routes.js';

const app = express(); //express permet de générer les route sur l'api

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(router);

sequelize.sync();

app.listen(5000);  //Ecoute sur le port 5000