const router = require('express').Router()
const db = require("../database")
const _ = require('lodash')
const moment = require('moment')
const uuidV4 = require('uuid').v4

router.get('/', async (req, res, next) => {
  const { page = 0 } = req.query
  let { limit } = req.query
  
  if (!limit || limit > 10) limit = 10

  const filter = {
    user: req.user._id
  }
  const totalRecords = await db.raceHistory.count(filter)
  const data = await db.raceHistory
    .find(filter)
    .sort({ timestamp: -1 })
    .skip(page * limit)
    .limit(limit)

  res.status(200).send({
    raceHistory: data,
    meta: {
      page,
      limit,
      totalRecords
    }
  })
})

router.post('/', async (req, res, next) => {
  const data = _.pick(req.body, ['wpm', 'time', 'textLength'])
  const doc = await db.raceHistory.insert({
    ...data,
    _id: uuidV4(),
    user: req.user._id,
    timestamp: moment().format()
  })

  res.status(201).send(doc)
})

module.exports = router