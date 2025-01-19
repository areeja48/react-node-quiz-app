const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Question = sequelize.define('question', {
  questionText: { type: DataTypes.STRING, allowNull: false , unique: true},
  choiceA: { type: DataTypes.STRING, allowNull: false },
  choiceB: { type: DataTypes.STRING, allowNull: false },
  choiceC: { type: DataTypes.STRING, allowNull: false },
  choiceD: { type: DataTypes.STRING, allowNull: false },
  correctChoice: { type: DataTypes.STRING, allowNull: false },
});

module.exports = Question;
