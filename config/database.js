const mysql = require("mysql");
const config = require('config');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const options = {
    connectionLimit: config.connectionLimit,
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    port: config.port,
    debug: config.debug,
    waitForConnections: true,
    multipleStatements: true
};

module.exports.connectMysql = () => {
    return new Promise((resolve, reject) => {
        let pool = mysql.createPool(options);
        pool.getConnection((err, connection) => {
            if (err) {
                return reject(err);
            } else {
                module.exports.connection = connection;
                let sessionStore = new MySQLStore(options, connection);
                return resolve(sessionStore);
            }
        });
    });
};

