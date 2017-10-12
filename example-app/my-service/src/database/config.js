module.exports = {
  database: process.env.DATABASE_NAME,
  dialect: 'postgres',
  host: process.env.POSTGRES,
  password: process.env.DATABASE_PASSWORD,
  username: process.env.DATABASE_USERNAME,
  // Remove when https://github.com/sequelize/sequelize/issues/8417 is reolved
  operatorsAliases: false,
}
