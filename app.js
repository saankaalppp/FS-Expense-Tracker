const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const sequelize = require('./utils/db');
const express = require('express');
const path = require('path');
const cors = require('cors');
const Expense = require('./models/expense');
const User = require('./models/user');
const Order = require('./models/order');
const Razorpay = require('razorpay');
require('dotenv').config();


const app = express();

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/user', userRoutes);
app.use('/', expenseRoutes);
app.use('/purchase', purchaseRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize
    .sync()
    .then(result => {
        app.listen(3000);
        console.log(result)
    })
    .catch(err => console.log(err));