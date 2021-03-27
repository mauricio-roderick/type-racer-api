const Datastore = require('nedb-promises')
const user = new Datastore({ filename: './database/user.db' })
const raceHistory = new Datastore({ filename: './database/race-history.db' })

const db = {
  user,
  raceHistory
}

module.exports = db