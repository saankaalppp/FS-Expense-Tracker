const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const FilesDownloaded = sequelize.define('filesdownloadeds', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    fileUrl: Sequelize.STRING,
    dateDownloaded: Sequelize.DATE
});

module.exports = FilesDownloaded;