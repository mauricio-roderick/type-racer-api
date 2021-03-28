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
    timestamp: moment().toDate()
  })

  res.status(201).send(doc)
})

router.get('/recent-stats', async (req, res, next) => {
  const timestamp = moment().subtract(8, 'hours').toDate();
  const data = await db.raceHistory
    .find({
      user: req.user._id,
      timestamp: {
        $gte: timestamp
      }
    })
    .sort({ timestamp: 1 })

  let averageWpm = 0
  let averageTime = 0

  if (data.length) {
    let totalWpm = 0
    let totalTime = 0

    data.forEach(item => {
      totalWpm += item.wpm
      totalTime += item.time
    })

    if (totalWpm) {
      averageWpm = (totalWpm / data.length)
    }
    if (totalTime) {
      averageTime = (totalTime / data.length)
    }
  }

  res.status(200).send({
    averageWpm: Math.round(averageWpm),
    averageTime: Math.round(averageTime),
    coverageDate: _.get(data, '0.timestamp', null)
  })
})

module.exports = router