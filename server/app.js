const path = require("path");
const express = require("express");
var cors = require("cors");

const sequelize = require("./util/database");
const bodyParser = require("body-parser");

const app = express();

app.set("views", __dirname + "/views");
app.engine("html", require("ejs").renderFile);

const userRoutes = require("./Routes/userRoutes");
const expenseRoutes = require("./Routes/expense");
const Expense = require("./models/expenseModel");
const User = require("./models/userModel");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/expense", expenseRoutes);
app.use(userRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

sequelize
  .sync()
  .then(() => {
    app.listen("4000");
  })
  .catch((err) => {
    console.log(err);
  });
