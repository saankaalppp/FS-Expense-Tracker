const userController = require('../controllers/user');
const express = require('express');
const router = express.Router();

router.post('/signup', userController.postUserSignUp);
router.post('/signin', userController.postUserSignIn);
router.post('/password/forgotpassword', userController.forgotPassword);
module.exports = router;