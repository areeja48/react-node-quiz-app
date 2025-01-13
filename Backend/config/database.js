const { Sequelize } = require('sequelize');
require('dotenv').config();

// Retrieve and log the MYSQL_PUBLIC_URL
const dbUrl = process.env.MYSQL_PUBLIC_URL;

console.log("MYSQL_PUBLIC_URL:", dbUrl); // Log to verify if it's set correctly

if (!dbUrl || dbUrl.trim() === '') {
  throw new Error('MYSQL_PUBLIC_URL environment variable is not set or is empty.');
}

// Initialize Sequelize with the database URL
const sequelize = new Sequelize(dbUrl, {
  dialect: 'mysql',
  dialectModule: require('mysql2'),
  logging: false, // Optional: turn off query logging
});

module.exports = sequelize;
