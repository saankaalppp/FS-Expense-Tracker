const express = require('express')
const router = express.Router()
const controllerUser = require('../controllers/user')



router.get('/signup',controllerUser.postUserSignUp )
router.post('/signup',controllerUser.postUserSignUp)
router.post('/checkUser',controllerUser.postUserSignIn)



module.exports = router;