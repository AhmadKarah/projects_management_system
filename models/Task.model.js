const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Project = require('./Project.model');

const Task = sequelize.define(
  'Task',
  {
    task_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    // description: {
    //   type: DataTypes.TEXT,
    // },
    status: {
      type: DataTypes.ENUM('pending', 'in-progress', 'completed'),
      defaultValue: 'pending',
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'low',
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Project,
        key: 'project_id',
      },
    },
  },
  {
    tableName: 'tasks',
    underscored: true,
    timestamps: true,
  }
);

Project.hasMany(Task, { foreignKey: 'project_id', onDelete: 'CASCADE' });
Task.belongsTo(Project, { foreignKey: 'project_id' });

module.exports = Task;
