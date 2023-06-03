const purchaseController = require('../controllers/purchase');

const userAuthentication = require('../middleware/userauthentication');

const Razorpay = require('razorpay');
const express = require('express');
const router = express.Router();

router.get('/premiummembership', userAuthentication.authenticate, purchaseController.purchasePremium);

router.post('/updatetransactionstatus', userAuthentication.authenticate, purchaseController.updateTransactionStatus);





module.exports = router;