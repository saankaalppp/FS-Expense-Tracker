const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../util/database');

module.exports.getLeaderboardData = async (req, res, next) => {
    try {
        const lbData = await User.findAll({
            attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('amount')), 'total_expense']],
            include: [
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group: ['users.id'],
            order: [['total_expense', 'DESC']]
        });

        res.status(200).json({ success: true, lbData: lbData });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: 'Something went wrong', success: false });
    }
};