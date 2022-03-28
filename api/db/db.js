const knexfile = require('../knexfile')['development']
const db       = require('knex')(knexfile)

module.exports = db 