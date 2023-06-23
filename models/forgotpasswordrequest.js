const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const ForgotPasswordRequests = sequelize.define('forgotpasswordrequests', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    isActive: Sequelize.BOOLEAN
});


module.exports = ForgotPasswordRequests;