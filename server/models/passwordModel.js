const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Password = sequelize.define("password", {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
  },
  isActive: Sequelize.BOOLEAN,
});

module.exports = Password;
