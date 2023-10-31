const razorpay = require("razorpay");
const Order = require("../models/orderModel");
const sequelize = require("../util/database");

exports.buyPremium = (req, res, next) => {
  let rzp = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  const amount = 2500;
  rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
    if (err) {
      console.log(err);
    } else {
      await req.user.createOrder({ orderId: order.id, status: "PENDING" });
      res.json({ order, key_id: rzp.key_id });
    }
  });
};

exports.updatePremiumStatus = async (req, res, next) => {
  const { order_id, payment_id } = req.body;
  const t = await sequelize.transaction();
  try {
    const order = await Order.findOne({ where: { orderId: order_id } });
    const updatePayment = order.update(
      {
        paymentId: payment_id,
        status: "SUCCESS",
      },
      { transaction: t }
    );
    const updatePremium = req.user.update(
      { isPremiumUser: true },
      { transaction: t }
    );
    await Promise.all([updatePayment, updatePremium]);
    await t.commit();
  } catch (err) {
    await t.rollback();
    console.log(err);
  }
};

exports.transactionFailed = async (req, res, next) => {
  const order_id = req.body.order_id;
  const order = await Order.findOne({ where: { orderId: order_id } });
  await order.update({ status: "FAILED" });
};

exports.checkPremium = async (req, res, next) => {
  return res.json(req.user.isPremiumUser);
};
