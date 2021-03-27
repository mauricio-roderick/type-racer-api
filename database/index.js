const Datastore = require('nedb-promises')
const user = new Datastore({ filename: './database/user.db' })

const db = {
  user
}

module.exports = db