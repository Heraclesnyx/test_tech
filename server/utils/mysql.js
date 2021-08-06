import  { Sequelize } from 'sequelize';

const sequelize = new Sequelize('appli_mobile','root','', {
    dialect :'mysql',
    host: 'localhost',
});

export default sequelize;
