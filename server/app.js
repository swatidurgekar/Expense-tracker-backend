const path = require("path");
const express = require("express");
var cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");

const sequelize = require("./util/database");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

app.set("views", __dirname + "/views");
app.engine("html", require("ejs").renderFile);

const userRoutes = require("./Routes/userRoutes");
const expenseRoutes = require("./Routes/expense");
const purchaseRoutes = require("./Routes/purchaseRoutes");
const passwordRoutes = require("./Routes/forgotPassword");
const Expense = require("./models/expenseModel");
const User = require("./models/userModel");
const Order = require("./models/orderModel");
const ResetPassword = require("./models/passwordModel");
const Download = require("./models/downloadModel");

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(helmet());
app.use(morgan("combined", { stream: accessLogStream }));

app.use("/expense", expenseRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/password", passwordRoutes);
app.use(userRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ResetPassword);
ResetPassword.belongsTo(User);

User.hasMany(Download);
Download.belongsTo(User);

sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT || "4000");
  })
  .catch((err) => {
    console.log(err);
  });
