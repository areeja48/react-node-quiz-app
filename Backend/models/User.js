const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
//const Result = require("./Result");
const User = sequelize.define('user', {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: true, unique: true },  
  password: { type: DataTypes.STRING, allowNull: false },
  contactno: { type: DataTypes.STRING, allowNull: true, unique: true },
  gender: { type: DataTypes.STRING, allowNull: true, unique: false },
  city: { type: DataTypes.STRING, allowNull: true, unique: false },
  profileImage: { type: DataTypes.STRING },
  otp: { type: DataTypes.INTEGER },
  otpExpiry: {type : DataTypes.DATE },
  usercomments: { type: DataTypes.TEXT, allowNull: true, unique: false },
  paymentok: { type: DataTypes.BOOLEAN, allowNull: true, unique: false },
});
//User.hasMany(Result, { foreignKey: 'userId', onDelete: 'CASCADE' });
module.exports = User;
