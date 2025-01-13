const { Sequelize } = require('sequelize');
require('dotenv').config();

// Retrieve the full database URL from environment variables
const dbUrl = process.env.MYSQL_PUBLIC_URL;

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
