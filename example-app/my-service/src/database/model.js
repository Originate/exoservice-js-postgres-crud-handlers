const Sequelize = require('sequelize')
const sequelizeInstance = require('./sequelize_instance.js')

module.exports = sequelizeInstance.define('user', {
  name: {
    allowNull: true,
    type: Sequelize.STRING,
  },
  id: {
    allowNull: false,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    type: Sequelize.STRING,
  },
})
