const expenseController = require('../controllers/expense');
const leaderboardController = require('../controllers/premium');
const userAuthentication = require('../middleware/userauthentication');
const express = require('express');
const router = express.Router();

router.get('/expenses', userAuthentication.authenticate,  expenseController.getExpenses);

router.post('/add-expense', userAuthentication.authenticate, expenseController.postAddExpense);

router.post('/delete-expense/', userAuthentication.authenticate, expenseController.postDeleteExpense);

module.exports = router;