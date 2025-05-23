const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Donation = sequelize.define('donation', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false, 
  },
  paymentId: {
    type: Sequelize.STRING,
    allowNull: true, 
  },
  orderId: {
    type: Sequelize.STRING,
    allowNull: false, 
    unique: true,
  },
  status: {
    type: Sequelize.STRING,
    defaultValue: 'PENDING',
  },
  amount: {
    type: Sequelize.FLOAT,
    allowNull: false,
  }
});

module.exports = Donation;
