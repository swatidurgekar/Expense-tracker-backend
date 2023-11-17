const path = require("path");
const express = require("express");
var cors = require("cors");

require("dotenv").config();
const sequelize = require("./util/database");
const bodyParser = require("body-parser");

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

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

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

console.log("password", process.env.DATABASE_USERNAME);

sequelize
  .sync()
  .then(() => {
    app.listen("3001");
  })
  .catch((err) => {
    console.log(err);
  });
