const entryController = require('../controllers/entry');
const leaderboardController = require('../controllers/premium');
const userAuthentication = require('../middleware/userauthentication');
const express = require('express');
const router = express.Router();

router.get('/Entries', userAuthentication.authenticate,  entryController.getEntries);

router.post('/add-entry', userAuthentication.authenticate, entryController.postAddEntry);

router.post('/delete-entry/', userAuthentication.authenticate, entryController.postDeleteEntry);

router.get('/download/', userAuthentication.authenticate, entryController.downloadEntries);

module.exports = router;