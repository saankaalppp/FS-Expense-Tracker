global.__basedir = __dirname;

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
const ForgotPasswordRequests = require('./models/forgotpasswordrequest');
const jade = require('ejs');
const Order = require('./models/order');
const Razorpay = require('razorpay');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__basedir, 'views', '/auth'));

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

User.hasMany(ForgotPasswordRequests);
ForgotPasswordRequests.belongsTo(User);

sequelize
    // .sync({ force: true })
    .sync()
    .then(result => {
        app.listen(3000);
    })
    .catch(err => console.log(err));