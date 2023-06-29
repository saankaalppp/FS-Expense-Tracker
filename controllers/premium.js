const User = require('../models/user');
const Entry = require('../models/entry');
const sequelize = require('../util/database');
let pageLimit=5;

module.exports.getLeaderboardData = async (req, res, next) => {
    try {
        const page = +req.query.page || 1;
        const lbData = await User.findAll({
            attributes: ['id', 'name', 'totalSavings'],
            order: [['totalSavings', 'DESC']],
            offset: (page-1)*pageLimit,
            limit: pageLimit    
        });

        const total = await User.count();

        const pageData = {
            currentPage: page,
            hasNextPage: (page*pageLimit) < total,
            nextPage: page+1,
            hasPreviousPage: (page > 1),
            previousPage: page-1,
            lastPage: Math.ceil(total/pageLimit)
        }

        console.log(lbData + " " + total);

        res.status(200).json({ success: true, lbData: lbData, pageData: pageData });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: 'Something went wrong', success: false });
    }
};