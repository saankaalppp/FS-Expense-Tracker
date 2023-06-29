const sequelize = require("../util/database");
const { Op } =  require('sequelize');

const getEntries = async (req, where) => {
    return req.user.getEntries();
};

module.exports = {
    getEntries
};