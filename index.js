module.exports = ({ modelName, sequelizeModel, sequelizeInstance }) => {
  return {
    beforeAll: async done => {
      try {
        await sequelizeInstance.authenticate()
        console.log('Connected to postgres database') // eslint-disable-line no-console
      } catch (error) {
        console.error('Unable to connect to the postgres database:', error) // eslint-disable-line no-console
      }
      done()
    },

    [`get ${modelName}`]: async ({ id }, { reply }) => {
      try {
        const instance = await sequelizeModel.findById(id)
        if (instance) {
          reply(`${modelName} details`, instance)
        } else {
          reply(`${modelName} not-found`, instance)
        }
      } catch (error) {
        console.error('Error getting: ', error) // eslint-disable-line no-console
      }
    },

    [`list ${modelName}`]: async (_, { reply }) => {
      try {
        const instances = await sequelizeModel.findAll()
        reply(`${modelName} list`, instances)
      } catch (error) {
        console.error('Error listing: ', error) // eslint-disable-line no-console
      }
    },

    [`create ${modelName}`]: async (data, { reply }) => {
      try {
        const instance = await sequelizeModel.create(data)
        reply(`${modelName} created`, instance)
      } catch (error) {
        console.error('Error creating: ', error) // eslint-disable-line no-console
      }
    },

    [`update ${modelName}`]: async (data, { reply }) => {
      try {
        const instance = await sequelizeModel.findById(data.id)
        if (instance) {
          await instance.update(data)
          reply(`${modelName} updated`, instance)
        } else {
          reply(`${modelName} not-found`)
        }
      } catch (error) {
        console.error('Error updating: ', error) // eslint-disable-line no-console
      }
    },

    [`delete ${modelName}`]: async ({ id }, { reply }) => {
      try {
        const instance = await sequelizeModel.findById(id)
        if (instance) {
          await instance.destroy()
          reply(`${modelName} deleted`, instance)
        } else {
          reply(`${modelName} not-found`)
        }
      } catch (error) {
        console.error('Error deleting: ', error) // eslint-disable-line no-console
      }
    },
  }
}
