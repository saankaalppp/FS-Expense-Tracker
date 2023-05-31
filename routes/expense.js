const expenseController = require('../controllers/expense');
const express = require('express');
const router = express.Router();

// getExpenses
router.get('/expenses', expenseController.getExpenses);

// addExpense
router.post('/add-expense', expenseController.postAddExpense);

// deleteExpense
router.post('/delete-expense/:expenseId', expenseController.postDeleteExpense);

module.exports = router;