const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../util/database');

module.exports.getLeaderboardData = async (req, res, next) => {
    try {
        const lbData = await User.findAll({
            attributes: ['id', 'name', 'totalExpense'],
            order: [['totalExpense', 'DESC']]
        });

        res.status(200).json({ success: true, lbData: lbData });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: 'Something went wrong', success: false });
    }
};