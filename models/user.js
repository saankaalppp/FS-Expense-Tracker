const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: Sequelize.STRING,
    isPremium: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    totalExpense: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
});

module.exports = User;