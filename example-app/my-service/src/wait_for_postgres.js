const sequelizeInstance = require('./database/sequelize_instance')

async function connectWithRetry(retryDelay) {
  try {
    await sequelizeInstance.authenticate()
    console.log('Connected') // eslint-disable-line no-console
    return
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(
      `Could not connect, retrying in ${retryDelay} milliseconds...`,
      error.toString()
    )
    await new Promise(resolve => setTimeout(resolve, retryDelay))
    await connectWithRetry(retryDelay * 2)
  }
}

async function main() {
  await connectWithRetry(1000)
  process.exit(0)
}

main()
