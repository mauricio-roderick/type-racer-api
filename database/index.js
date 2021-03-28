const Datastore = require('nedb-promises')
const user = new Datastore({ filename: './database/user.db' })
const raceHistory = new Datastore({ filename: './database/race-history.db' })

raceHistory.ensureIndex({ fieldName: 'timestamp'})

const db = {
  user,
  raceHistory
}

module.exports = db