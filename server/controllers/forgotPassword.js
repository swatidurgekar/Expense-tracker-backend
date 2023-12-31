const Sib = require("sib-api-v3-sdk");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/userModel");
const ForgotPassword = require("../models/passwordModel");
const sequelize = require("../util/database");
const bcrypt = require("bcrypt");

const client = Sib.ApiClient.instance;

const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.API_KEY;

const tranEmailApi = new Sib.TransactionalEmailsApi();

const sender = {
  email: "swatidurgekar@gmail.com",
};

exports.forgotPassword = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const id = uuidv4();
    const user = await User.findOne({ where: { username: req.body.email } });
    if (user) {
      const createRequest = ForgotPassword.create(
        {
          id,
          isActive: true,
          userId: user.id,
        },
        { transaction: t }
      );
      const recievers = [
        {
          email: req.body.email,
        },
      ];

      const sendMail = tranEmailApi.sendTransacEmail(
        {
          sender,
          to: recievers,
          subject: "Reset your password",
          htmlContent: `
    <p>Hii</p>
    <p>We recieved a request to reset the password of your account.</p>
    <p>To reset your password copy and paste the url in your browser</p>
    <a href="/">http://localhost:4000/password/resetPassword/${id}</a>
    `,
        },
        { transaction: t }
      );
      await Promise.all([createRequest, sendMail]);
      await t.commit();
      res.json(true);
    } else {
      res.json(false);
      await t.rollback();
    }
  } catch (err) {
    await t.rollback();
    console.log(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const request = await ForgotPassword.findByPk(requestId);
    if (request && request.isActive) {
      res.redirect(`http://localhost:3000/updatePassword/${requestId}`);
    } else {
      res.redirect("http://localhost:3000/forgotPassword");
    }
  } catch (err) {
    console.log(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const { password1 } = req.body;
    const request = await ForgotPassword.findByPk(requestId);
    if (request && request.isActive) {
      const user = await request.getUser();
      if (!password1) {
        res.json({ message: "invalid password" });
      } else {
        bcrypt.hash(password1, 10, async (err, hashValue) => {
          if (err) {
            throw new Error();
          } else {
            try {
              await user.update({ password: hashValue });
              await request.update({ isActive: false });
              res.redirect("http://localhost:3000/login");
            } catch (err) {
              console.log(err);
            }
          }
        });
      }
    } else {
      res.json({ message: "request expired!" });
    }
  } catch (err) {
    console.log(err);
  }
};
