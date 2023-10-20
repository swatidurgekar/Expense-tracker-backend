const Sib = require("sib-api-v3-sdk");

const client = Sib.ApiClient.instance;

const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.API_KEY;

const tranEmailApi = new Sib.TransactionalEmailsApi();

const sender = {
  email: "swatidurgekar@gmail.com",
};

exports.forgotPassword = (req, res, next) => {
  const recievers = [
    {
      email: req.body.email,
    },
  ];

  tranEmailApi
    .sendTransacEmail({
      sender,
      to: recievers,
      subject: "Reset your password",
      textContent: `
  Hello!
  `,
    })
    .then(res.json(true))
    .catch((err) => console.log(err));
};
