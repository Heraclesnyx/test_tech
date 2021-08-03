import  express from 'express';

import  sequelize from './utils/mysql.js';

import router from './routes/routes.js';

const app = express();

app.use(express.urlencoded({ extended: false }));

app.use((res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
});

app.use(router);

sequelize.async();

app.listen(5000);