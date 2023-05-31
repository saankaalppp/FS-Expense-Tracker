const User = require('../models/user');
const bcrypt = require('bcrypt');

module.exports.postUserSignUp = async (req, res, next) => {
    try {
        const users = await User.findAll({ where: { email: req.body.email } });

        if(users[0]) return res.status(400).json({ message: "User already exist", success: false });

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
module.exports.postUserSignIn = async (req, res, next) => {
    try {
        const users = await User.findAll({
            where: { email: req.body.email }
        });

        const user = users[0];

        if(!user)
            return res.status(404).json({ message: 'Error 404 : User not Found!', success: false });

        const isValidPassword = await bcrypt.compare(req.body.password, user.password);

        if(!isValidPassword) return res.status(401).json({ message: "Error 401 (Unauthorized) : Incorrect Password!", success: false });

        return res.status(200).json({ message: "User login succesfull!", success: true });

    } catch(err) {
        return res.status(500).json({ message: "Some error occurred!", success: false });
    }
};