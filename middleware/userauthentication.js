const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

module.exports.authenticate = async (req, res, next) => {
    try {
        console.log("authenticating..." + process.env.PRIVATE_KEY);
        const token = req.get('Authorization');
        
        console.log(token);
        const payload = jwt.verify(token, process.env.PRIVATE_KEY);
        const user = await User.findByPk(payload.userId);
        req.user = user;
        next();
    } catch(err) {
        console.log(err);
        return res.status(401).json({ message: "Unauthorized", success: false });
    }
};