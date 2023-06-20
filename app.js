const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const dashboardRoutes = require('./routes/dashboard');
const premiumRoutes = require('./routes/premium');
const purchaseRoutes = require('./routes/purchase');
const sequelize = require('./util/database');
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
app.use('/', dashboardRoutes);
app.use('/premium', premiumRoutes);
app.use('/purchase', purchaseRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize
    .sync()
    .then(result => {
        app.listen(3000);
    })
    .catch(err => console.log(err));