const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../util/database');
// getExpenses

module.exports.getExpenses = async (req, res, next) => {
    try {
        const expenses = await req.user.getExpenses();
        return res.status(200).json({ expenses: expenses, success: true });
    } catch (err) {
        // console.log(err);
        return res.status(500).json({ message: "Some error occurred", success: false });
    }
}

// postAddExpense

module.exports.postAddExpense = async (req, res, next) => {
    try {
        const user = req.user;

        await user.createExpense({
            amount: req.body.amount,
            description: req.body.description,
            category: req.body.category
        }, { transaction: t });
        const user = req.user;

        user.totalExpense = Number(user.totalExpense) + Number(req.body.amount);

        await user.save({ transaction: t });

        await t.commit();
        return res.status(200).json({ success: true });
    } catch (err) {
        await t.rollback();
        console.log(err);
        return res.status(500).json({ message: "Some error occurred", success: false });
    }
}

// postDeleteExpense

module.exports.postDeleteExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const expenseId = req.body.expenseId;
        if (expenseId == undefined || expenseId.length === 0)
            return res.status(400).json({ message: 'Bad request', success: false });

        const user = req.user;

        const expenses = await user.getExpenses({ where: { id: expenseId } });
        const expense = expenses[0];
        await expense.destroy({ transaction: t });

        user.totalExpense = Number(user.totalExpense) - Number(expense.amount);

        await user.save({ transaction: t });

        await t.commit();
        return res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        await t.rollback();
        return res.status(500).json({ message: "Some error occurred", success: false });
    }
}