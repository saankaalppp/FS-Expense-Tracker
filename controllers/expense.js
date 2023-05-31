const Expense = require('../models/expense');

// getExpenses
module.exports.getExpenses = async (req, res, next) => {
    try{
        const expenses = await Expense.findAll();
        return res.json(expenses);
    } catch(err) {
        console.log(err);
    }

}

// postAddExpense

module.exports.postAddExpense = async (req, res, next) => {
    try {
        const result = await Expense.create({
            amount: req.body.amount,
            description: req.body.description,
            category: req.body.category
        });
        return res.json({ created: true });
    } catch(err) {
        console.log(err);
    }
}


// postDeleteExpense

module.exports.postDeleteExpense = async (req, res, next) => {
    try {
        const expense = await Expense.findByPk(req.params.expenseId);
        const result = await expense.destroy();
        return res.json({ deleted: true });
    } catch(err) {
        console.log(err);
    }
}