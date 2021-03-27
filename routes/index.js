const router = require('express').Router()

router.get('/', (req, res, next) => {
  res.status(200).send({
    message: 'Type Racer API now running.'
  })
})

module.exports = router