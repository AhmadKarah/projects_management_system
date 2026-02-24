const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define(
  'User',
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: flase,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: flase,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: flase,
    },
  },
  {
    tableName: 'users',
    underscored: true,
    timestamps: true,
  }
);

module.exports = User;
