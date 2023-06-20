const Sequelize = require('sequelize')
const sequelize = new Sequelize("expensetracker","root","",{
    dialect:"mysql",
    host:"127.0.0.1"
})

module.exports = sequelize;