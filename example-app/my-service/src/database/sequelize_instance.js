const Sequelize = require('sequelize')
const databaseConfig = require('./config')

module.exports = new Sequelize(databaseConfig)
