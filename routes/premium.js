const premiumController = require('../controllers/premium');

const userAuthentication = require('../middleware/userauthentication');

const express = require('express');

const router = express.Router();




router.get('/leaderboard', userAuthentication.authenticate, premiumController.getLeaderboardData);

module.exports = router;