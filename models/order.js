const Sequelize = require('sequelize');
const sequelize = require('../utils/db');

const Order = sequelize.define('orders', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    orderId: Sequelize.STRING,
    paymentId: Sequelize.STRING,
    status: Sequelize.STRING
});

module.exports = Order;