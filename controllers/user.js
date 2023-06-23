const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SibApiV3Sdk = require('sib-api-v3-sdk');
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

    var client = SibApiV3Sdk.ApiClient.instance;

    // Configure API key authorization: api-key
    var apiKey = client.authentications['api-key'];
    apiKey.apiKey = process.env.SENDINBLUE_EMAIL_KEY;

    var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

    sendSmtpEmail = {
        sender: {
            email: 'vispsen@gmail.com',
            name: 'Vispsen'
        },
        to: [{
            email: req.body.email,
        }],
        subject: 'Test Email',
        textContent: 'Testing email with sendinblue',
        params: {
            API_KEY: process.env.SENDINBLUE_EMAIL_KEY
        },
        headers: {
            'X-Mailin-custom': 'api-key:{{params.API_KEY}}|content-type:application/json|accept:application/json'
        }
    };

    apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
        console.log('API called successfully. Returned data: ' + data);
    }, function (error) {
        console.error(error);
    });
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
    generateAccessToken
};  