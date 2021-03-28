const router = require('express').Router()
const Chance = require('chance')

const chance = new Chance()
const maxWords = 100

router.get('/random-text', (req, res, next) => {
  let { words } = req.query

  if (isNaN(words) || words > maxWords) {
    words = maxWords
  }

  res.status(200).send({
    text: chance.sentence({ words })
  })
})

module.exports = router