const userController = require('../controllers/user');
const express = require('express');
const router = express.Router();

router.post('/signup', userController.postUserSignUp);
router.post('/signin', userController.postUserSignIn);
module.exports = router;