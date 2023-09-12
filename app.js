const path = require("path");
const express = require("express");

const sequelize = require("./util/database");
const bodyParser = require("body-parser");

const app = express();

app.set("views", __dirname + "/views");
app.engine("html", require("ejs").renderFile);
// app.use(express.static(path.join(__dirname, "js")));

const userRoutes = require("./Routes/userRoutes");
const expenseRoutes = require("./Routes/expense");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/expense", expenseRoutes);
app.use(userRoutes);

sequelize
  .sync()
  .then(() => {
    app.listen("3000");
  })
  .catch((err) => {
    console.log(err);
  });
