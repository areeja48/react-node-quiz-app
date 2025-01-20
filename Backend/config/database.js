const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbUrl = process.env.MYSQL_PUBLIC_URL;

if (!dbUrl || dbUrl.trim() === '') {
  throw new Error('MYSQL_PUBLIC_URL environment variable is not set or is empty.');
}

const sequelize = new Sequelize(dbUrl, {
  dialect: 'mysql',
  dialectModule: require('mysql2'),
  logging: false, // Optional: turn off query logging
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

module.exports = sequelize;