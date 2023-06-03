const Sequelize = require('sequelize')
const sequelize = require('../utils/db')

const User = sequelize.define('User',{
    id : {
        type : Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement : true,
        allowNul : false
    },
    name : {
        type : Sequelize.STRING,
        allowNul : false
    },
    email : {
        type : Sequelize.STRING,
        unique : true,
        allowNul : false
    },
    password: Sequelize.STRING,
    isPremium: {
        type: Sequelize.BOOLEAN,
        default: false
    }
})

module.exports = User;