const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Result = sequelize.define('result', {
  score: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  userAnswer: { 
    type: DataTypes.JSON, 
    allowNull: false 
  },
  attemptedQuestions: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    defaultValue: 0 
  },
  correctAnswers: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    defaultValue: 0 
  },
  wrongAnswers: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    defaultValue: 0
  }

});

// Define associations
//User.hasMany(Result, { foreignKey: 'userId', onDelete: 'CASCADE' });
Result.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

module.exports = Result;
