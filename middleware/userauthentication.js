const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.authenticate = async (req, res, next) => {
    try {
        const token = req.get('Authorization');
        const userId = jwt.verify(token, 'mySecureKey').userId;
        const user = await User.findByPk(userId);
        req.user = user;
        next();
    } catch(err) {
        console.log(err);
        return res.status(401).json({ message: "Unauthorized", success: false });
    }
};