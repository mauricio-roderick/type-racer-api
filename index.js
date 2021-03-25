const express = require('express')
const cors = require('cors')
const passport = require('passport')
const BasicStrategy = require('passport-http').BasicStrategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const logger = require('morgan')
const Datastore = require('nedb-promises')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const saltRounds = 10
const JWT_SECRET = '123'

const user = new Datastore({ filename: './database/user.db' })

const jwtPassportOptions = {
  secretOrKey: JWT_SECRET,
  ignoreExpiration: true,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}
passport.use(new JwtStrategy(jwtPassportOptions, function(jwtPayload, done) {
  done(null, jwtPayload)
}));

passport.use(new BasicStrategy(
  async (username, password, done) => {
    try {
      const matchedUser = await user.findOne({ username })
      if (matchedUser) {
        const matchedPasw = await bcrypt.compare(password, matchedUser.hash)
        if (matchedPasw) {
          delete matchedUser.hash
          return done(null, matchedUser)
        }
      }

      done()
    } catch (e) {
      done(e)
    }
  }
))

const app = express()

app.use(logger("dev"))
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.status(500).send({
    message: new Date()
  })
})

app.all('/private?/*',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json(req.user)
  })

app.post('/oauth/token',
  passport.authenticate('basic', { session: false }),
  (req, res) => {
    const accessToken = jwt.sign(req.user, JWT_SECRET)
    res.json({ accessToken })
  })

const listener = app.listen(8080, () => {
  console.log("Listening on port " + listener.address().port)
})