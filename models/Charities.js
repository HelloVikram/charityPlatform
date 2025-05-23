const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Charities = sequelize.define('Charities', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  goal_amount: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  current_amount: {
    type: Sequelize.FLOAT,
    defaultValue: 0,
  },
  category: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  location: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  isApproved: {
  type: Sequelize.BOOLEAN,
  defaultValue: false,
}
});

module.exports = Charities;
