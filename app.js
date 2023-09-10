const path = require("path");
const express = require("express");
const app = express();
const userRoutes = require("./Routes/userRoutes");
const sequelize = require("./util/database");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.set("views", __dirname + "/views");
app.engine("html", require("ejs").renderFile);

app.use(userRoutes);

sequelize
  .sync()
  .then(() => {
    app.listen("3000");
  })
  .catch((err) => {
    console.log(err);
  });
