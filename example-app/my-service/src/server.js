const sequelizeInstance = require('./database/sequelize_instance')
const sequelizeModel = require('./database/model')
const { bootstrap } = require('exoservice')
const createHandlers = require('../exoservice-sequelize-crud-handlers-copy')

bootstrap(
  createHandlers({
    modelName: 'user',
    sequelizeModel,
    sequelizeInstance,
  })
)
