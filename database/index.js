const Datastore = require('nedb-promises')
const user = new Datastore({ filename: './database/user.db' })
const race = new Datastore({ filename: './database/race.db' })

const db = {
  user,
  race
}

module.exports = db