const router = require('express').Router()
const passport = require('passport')

router.all('/*',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => next())

module.exports = router