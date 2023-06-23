const ForgotPasswordRequests = require('../models/forgotpasswordrequest');

module.exports.validateRequest = async (req, res, next) => {
    try {
        console.log('hllo');
        const requestId = req.params.requestId;
        const request = await ForgotPasswordRequests.findByPk(requestId);

        if(!request)
            return res.status(400).send({ message: 'Bad request', success: false });

        if(!request.isActive)
            return res.status(400).send({ message: 'Link expired', success: false });

        next();

    } catch(err) {
        return res.status(500).json({ message: 'Something went wrong!', success: false });
    }
}