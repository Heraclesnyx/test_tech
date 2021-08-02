require('babel-register');
const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    database:'appli_mobile',
    user: 'root',
    password: ''

});


// Connection à la BDD
db.connect((err) => {

    if(err){
        console.log(err.message)
    }else{
        console.log('Connected')
    }
})
