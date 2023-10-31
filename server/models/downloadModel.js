const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const Download = sequelize.define("downloads", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});
module.exports = Download;
