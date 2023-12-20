// models/accountReport.js

const Sequelize = require('sequelize');
const sequelize = require('../config');

const AccountReport = sequelize.define('accountReport', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  reportsNumber: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  accountId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  blocked: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
});

module.exports = AccountReport;
