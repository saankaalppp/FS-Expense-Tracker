const Razorpay = require('razorpay');
const Order = require('../models/order');
const shortid = require('shortid');
require('dotenv').config();

module.exports.purchasePremium = async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        try {
            let order = await rzp.orders.create({ amount: 100, currency: "INR" });
            await req.user.createOrder({ orderId: order.id, status: "PENDING" });
            return res.status(200).json({ order, key_id: rzp.key_id });
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
} catch (err) {
    console.log(err);
    return res.status(403).json({ message: "Something went wrong", error: err });
    }
}

module.exports.updateTransactionStatus = async (req, res) => {
    try {
        const { order_id, payment_id } = req.body;

        const order = await Order.findOne({ where: { orderId: order_id } });

        if(!payment_id) {
            await order.update({ paymentId: null, status: "FAILED" });
            return res.status(202).json({ message: "Transaction failed", success: false });
        }

        const updateStatusToSuccess = order.update({ paymentId: payment_id, status: "SUCCESSFULL" });
        const updateUserToPremium = req.user.update({ isPremium: true });
        Promise.all([updateStatusToSuccess, updateUserToPremium]).then(() => {
            return res.status(202).json({ message: "Transaction Successfull", success: true });
        }).catch((err) => {
            throw new Error(err);
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error!", success: true });
    }
}