const expenseController = require('../controllers/expense');
const incomeController = require('../controllers/income');
const leaderboardController = require('../controllers/premium');
const userAuthentication = require('../middleware/userauthentication');
const express = require('express');
const router = express.Router();

router.get('/expenses', userAuthentication.authenticate,  expenseController.getExpenses);

router.post('/add-expense', userAuthentication.authenticate, expenseController.postAddExpense);

router.post('/delete-expense/', userAuthentication.authenticate, expenseController.postDeleteExpense);

router.post('/add-income', userAuthentication.authenticate, incomeController.postAddIncome);

router.post('/incomes', userAuthentication.authenticate, incomeController.getIncomes);

router.post('/delete-income', userAuthentication.authenticate, incomeController.postDeleteIncome);


router.get('/download/', userAuthentication.authenticate, expenseController.downloadExpenses);

module.exports = router;