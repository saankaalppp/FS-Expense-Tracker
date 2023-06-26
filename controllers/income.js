const Income = require('../models/income');
const User = require('../models/user');
const sequelize = require('../util/database');
const UserServices = require('../services/userservices');
const S3Services = require('../services/s3services');
const FilesDownloaded = require('../models/filesdownloaded');
const AWS = require('aws-sdk');
require('dotenv').config();

const getIncomes = async (req, res, next) => {
    try {
        const incomes = await req.user.getIncomes(req);
        return res.status(200).json({ incomes: incomes, success: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Some error occurred", success: false });
    }
}

const postAddIncome = async (req, res, next) => {
    const t = await sequelize.transaction();

    try {
        const user = req.user;

        await req.user.createIncome({
            amount: req.body.amount,
            description: req.body.description,
            date: req.body.date
        });

        user.totalIncome = Number(user.totalIncome) + Number(req.body.amount);

        await user.save({ transaction: t });

        await t.commit();

        return res.status(200).json({ success: true });
    } catch (err) {
        await t.rollback();
        console.log(err);
        return res.status(500).json({ message: "Some error occurred", success: false });
    }
}

const postDeleteIncome = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const incomeId = req.body.incomeId;
        if (incomeId == undefined || incomeId.length === 0)
            return res.status(400).json({ message: 'Bad request', success: false });

        const user = req.user;

        const incomes = await user.getIncomes({ where: { id:incomeId } });
        const income = incomes[0];

        await income.destroy({ transaction: t });

        user.totalIncome = Number(user.totalIncome) - Number(income.amount);

        await user.save({ transaction: t });

        await t.commit();

        return res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        await t.rollback();
        return res.status(500).json({ message: "Some error occurred", success: false });
    }
}

const downloadIncomes = async (req, res) => {
    try {
        const incomes = await UserServices.getIncomes(req);
        const stringifiedIncomes = JSON.stringify(incomes);
        const dateDownloaded = new Date();
        const filename = `Income${req.user.id}/${dateDownloaded}.txt`;
        const fileUrl = await S3Services.uploadToS3(stringifiedIncomes, filename);

        await FilesDownloaded.create({
            fileUrl: fileUrl,
            dateDownloaded: dateDownloaded,
            userId: req.user.id
        });

        return res.status(200).json({ fileUrl: fileUrl, success: true });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ fileUrl: '', success: false, err: err });
    }
}

module.exports = {
    getIncomes,
    postAddIncome,
    postDeleteIncome
}