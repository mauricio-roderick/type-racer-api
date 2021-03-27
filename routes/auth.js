const router = require('express').Router()
const jwt = require('jsonwebtoken')
const passport = require('passport')
const BasicStrategy = require('passport-http').BasicStrategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const bcrypt = require('bcrypt')

const db = require("../database")

const JWT_SECRET = 'WwNqSQSr2r2w2cY4meYt6AS9BLWWvfnsAxKY5wn2cNjtTTt9ZU'
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
      const matchedUser = await db.user.findOne({ username })
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

router.post('/token',
  passport.authenticate('basic', { session: false }),
  (req, res) => {
    const accessToken = jwt.sign(req.user, JWT_SECRET)
    res.json({ accessToken })
  })

module.exports = router






