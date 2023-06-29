const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Entry = sequelize.define('entries', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      entryType: {
        type: Sequelize.STRING,
        allowNull: false
      }
});

module.exports = Entry;