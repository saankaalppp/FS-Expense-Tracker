const userController = require('../controllers/user');
const forgotPasswordValidation = require('../middleware/forgotpasswordvalidation');
const path = require('path');
const express = require('express');
const router = express.Router();

router.use(express.static(path.join(__basedir, 'public')));

router.post('/signup', userController.postUserSignUp);
router.post('/signin', userController.postUserSignIn);
router.post('/password/forgotpassword', userController.forgotPassword);

router.get('/password/resetpassword/:requestId',forgotPasswordValidation.validateRequest, userController.getResetPassword);
router.post('/password/updatepassword/:requestId', forgotPasswordValidation.validateRequest,  userController.postUpdatePassword);

module.exports = router;