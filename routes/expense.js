const expenseController = require('../controllers/expense');
const userAuthentication = require('../middleware/userauthentication');
const express = require('express');
const router = express.Router();

// getExpenses
router.get('/expenses', userAuthentication.authenticate, expenseController.getExpenses);

// addExpense
router.post('/add-expense', userAuthentication.authenticate, expenseController.postAddExpense);

// deleteExpense
router.post('/delete-expense/:expenseId', userAuthentication.authenticate, expenseController.postDeleteExpense);

module.exports = router;