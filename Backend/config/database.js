const { Sequelize } = require('sequelize');
require('dotenv').config();

// Extract the database URL from the environment variable
const dbUrl = process.env.MYSQL_PUBLIC_URL;


const sequelize = new Sequelize(dbUrl, {
  dialect: 'mysql',  // Define the dialect as 'mysql'
  dialectModule: require('mysql2'),  // Specify the mysql2 dialect module
  logging: false,  // Optional: turn off logging if not needed
});

// To retain data in tables after backend restart.
// sequelize.sync({ force: false });

module.exports = sequelize;
