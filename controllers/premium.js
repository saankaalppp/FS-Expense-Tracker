const User = require('../models/user');
const Expense = require('../models/expense');

module.exports.getLeaderboardData = async (req, res, next) => {
    try {
        const users = await User.findAll();

        const lbData=[];

        await Promise.all(users.map(async (user) => {
            const expenses = await Expense.findAll({ where: { id: user.id } });
            const totalExpense = expenses.reduce((total, expense) => {
                return total + expense.amount;
            }, 0);

            lbData.push({
                name: user.name,
                totalExpense: totalExpense
            });
        }));

        lbData.sort((user1, user2) => user2.totalExpense - user1.totalExpense);

        res.status(200).json({ success: true, lbData: lbData });
    } catch(err) {
        return res.status(500).json({ message: 'Something went wrong', success: false });
    }
};