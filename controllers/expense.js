const Expense = require('../models/expense');
const User = require('../models/user');
// getExpenses

module.exports.getExpenses = async (req, res, next) => {
    try{
        const expenses = await req.user.getExpenses();
        return res.status(200).json({ expenses: expenses, success: true });
    } catch(err) {
        // console.log(err);
        return res.status(500).json({ message: "Some error occurred" , success: false });
    }
}

// postAddExpense

module.exports.postAddExpense = async (req, res, next) => {
    try {
        await req.user.createExpense({
            amount: req.body.amount,
            description: req.body.description,
            category: req.body.category
        });
        const user = req.user;

        user.totalExpense = Number(user.totalExpense) + Number(req.body.amount);

        await user.save();
        return res.status(200).json({ success: true });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Some error occurred", success: false });
    }
}

// postDeleteExpense

module.exports.postDeleteExpense = async (req, res, next) => {
    try {
        const expenses = await req.user.getExpenses({ where: { id: req.body.expenseId }});
        const expense = expenses[0];
        const result = await expense.destroy();
        return res.status(200).json({ success: true });
    } catch(err) {
        // console.log(err);
        return res.status(500).json({ message: "Some error occurred", success: false });
    }
}