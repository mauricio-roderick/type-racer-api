const router = require('express').Router()
const db = require("../database")
const _ = require('lodash')
const moment = require('moment')
const uuidV4 = require('uuid').v4

router.get('/', async (req, res, next) => {
  const { page } = req.query
  let { limit } = req.query
  
  if (!limit || limit > 20) limit = 20

  const filter = {
    user: req.user._id
  }
  const totalRecords = await db.race.count(filter)
  const data = await db.race
    .find(filter)
    .sort({ timestamp: -1 })
    .skip(page * limit)
    .limit(limit)

  res.status(200).send({
    race: data,
    meta: {
      totalRecords
    }
  })
})

router.post('/', async (req, res, next) => {
  const data = _.pick(req.body, ['wpm', 'time', 'textLength'])
  const doc = await db.race.insert({
    ...data,
    _id: uuidV4(),
    user: req.user._id,
    timestamp: moment().format()
  })

  res.status(201).send(doc)
})

module.exports = router