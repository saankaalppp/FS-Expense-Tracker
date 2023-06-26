const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../util/database');
const UserServices = require('../services/userservices');
const S3Services = require('../services/s3services');
const FilesDownloaded = require('../models/filesdownloaded');
const AWS = require('aws-sdk');
require('dotenv').config();

// getExpenses

const getExpenses = async (req, res, next) => {
    try {
        const expenses = await UserServices.getExpenses(req);
        return res.status(200).json({ expenses: expenses, success: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Some error occurred", success: false });
    }
}

// postAddExpense

const postAddExpense = async (req, res, next) => {
    try {
        const user = req.user;

        await user.createExpense({
            amount: req.body.amount,
            description: req.body.description,
            category: req.body.category,
            date: req.body.date
        }, { transaction: t });
        // const user = req.user;

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

const postDeleteExpense = async (req, res, next) => {
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

const downloadExpenses = async (req, res) => {
    try {
        const expenses = await UserServices.getExpenses(req);
        const stringifiedExpenses = JSON.stringify(expenses);
        const dateDownloaded = new Date();
        const filename = `Expense${req.user.id}/${dateDownloaded}.txt`;
        const fileUrl = await S3Services.uploadToS3(stringifiedExpenses, filename);

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
    getExpenses,
    postAddExpense,
    postDeleteExpense,
    downloadExpenses
}