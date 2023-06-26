const User = require('../models/user');
const ForgotPasswordRequest = require('../models/forgotpasswordrequest');
const FilesDownloaded = require('../models/filesdownloaded');   
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../util/database');
const path = require('path');
require('dotenv').config();

const postUserSignUp = async (req, res, next) => {
    try {
        const users = await User.findAll({ where: { email: req.body.email } });
        
        if (users[0]) return res.status(400).json({ message: "User already exist", success: false });
        const salt = await bcrypt.genSalt(10);
        let password = req.body.password;
        password = await bcrypt.hash(password, salt);
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: password
        });

        return res.status(200).json({ message: "You are registered successfully!", success: true });
    } catch(err) {
        return res.status(500).json({ message: "Some error occurred!", success: false });
    }
};
const postUserSignIn = async (req, res, next) => {
    try {
        const users = await User.findAll({
            where: { email: req.body.email }
        });
        const user = users[0];
        if(!user)
            return res.status(404).json({ message: 'Error 404 : User not Found!', success: false });
        const isValidPassword = await bcrypt.compare(req.body.password, user.password);

        if (!isValidPassword) return res.status(401).json({ message: "Error 401 (Unauthorized) : Incorrect Password!", success: false });

        return res.status(200).json({
            message: "User login succesfull!", success: true,
            token: generateAccessToken({ userId: user.id, name: user.name, email: user.email, isPremium: user.isPremium })
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Some error occurred!", success: false });
    }
};

const forgotPassword = async (req, res, next) => {

    const t = await sequelize.transaction();

    try {
        const email = req.body.email;

        const users = await User.findAll({ where: { email } });
        const user = users[0];

        if(!user)
            return res.status(400).json({ message: 'Incorrect Email', success: false });

        const requests = await ForgotPasswordRequest.findAll({ where: { userId: user.id, isActive: true } });

        let request = requests[0];

        let requestId;

        if(!request) {
            requestId = uuidv4();

            request = {
                id: requestId,
                userId: user.id,
                isActive: true
            };

            await ForgotPasswordRequest.create(request, { t });
        }
        else {
            requestId = request.id;
        }

        var client = SibApiV3Sdk.ApiClient.instance;

        // Configure API key authorization: api-key
        var apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.SENDINBLUE_EMAIL_KEY;

        var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

        var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

        sendSmtpEmail = {
            sender: {
                email: 'vispsen@gmail.com',
                name: 'Ignite Pvt. Ltd.'
            },
            to: [{
                email: req.body.email,
            }],
            subject: 'Reset Password',
            htmlContent: `
            <html><head></head><body><a href="http://localhost:3000/user/password/resetpassword/${requestId}">Click on this link to reset your password</a></body></html>
            `,
            params: {
                API_KEY: process.env.SENDINBLUE_EMAIL_KEY
            },
            headers: {
                'X-Mailin-custom': 'api-key:{{params.API_KEY}}|content-type:application/json|accept:application/json'
            }
        };

        apiInstance.sendTransacEmail(sendSmtpEmail).then(async function (data) {
            await t.commit();
            console.log('API called successfully. Returned data: ' + data);
        }, function (error) {
            throw new Error(err);
        });
    } catch(err) {
        await t.rollback();       
        console.log(err);
        return res.status(500).json({ message: 'Something went wrong!', success: false });
    }

}

const getResetPassword = async (req, res, next) => {
    return res.render('reset-password', { requestId: req.params.requestId });
}

const postUpdatePassword = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        let newPassword = req.body.newPassword;

        const salt = await bcrypt.genSalt(10);
        newPassword = await bcrypt.hash(newPassword, salt);

        const request = await ForgotPasswordRequest.findByPk(req.params.requestId);

        await User.update({ password: newPassword }, { where: { id: request.userId }, t });

        request.isActive = false;

        await request.save({ t });

        await t.commit();

        return res.status(200).json({ message: 'Password updated successfully!', success: true });

    } catch(err) {
        console.log(err);
        await t.rollback();
        return res.status(500).json({ message: "Something went wrong!", success: false });
    }
}

const getFilesDownloaded = async (req, res) => {
    try {
        const result = await FilesDownloaded.findAll({ where: { userId: req.user.id } });
        return res.status(200).json({ filesData: result, success: true });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ success: false, err: err });
    }
}

const generateAccessToken = function (user) {
    console.log("authenticating..." + process.env.PRIVATE_KEY);
    const token = jwt.sign(user, process.env.PRIVATE_KEY);
    console.log(token);
    return token;
}

module.exports = {
    postUserSignUp,
    postUserSignIn,
    forgotPassword,
    getResetPassword,
    postUpdatePassword, 
    getFilesDownloaded,
    generateAccessToken
};  