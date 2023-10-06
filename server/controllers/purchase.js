const razorpay = require("razorpay");
const Order = require("../models/orderModel");

exports.buyPremium = (req, res, next) => {
  let rzp = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  const amount = 2500;
  rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
    if (err) {
      console.log(err);
    } else {
      req.user.createOrder({ orderId: order.id, status: "PENDING" });
      res.json({ order, key_id: rzp.key_id });
    }
  });
};

exports.updatePremiumStatus = async (req, res, next) => {
  const { order_id, payment_id } = req.body;
  const order = await Order.findOne({ where: { orderId: order_id } });
  const updatePayment = order.update({
    paymentId: payment_id,
    status: "SUCCESS",
  });
  const updatePremium = req.user.update({ isPremiumUser: true });
  await Promise.all([updatePayment, updatePremium]);
};

exports.transactionFailed = async (req, res, next) => {
  const order_id = req.body.order_id;
  const order = await Order.findOne({ where: { orderId: order_id } });
  await order.update({ status: "FAILED" });
};

exports.checkPremium = async (req, res, next) => {
  return res.json(req.user.isPremiumUser);
};
