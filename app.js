const express = require('express')
const cors = require('cors')
const path = require('path')
const logger = require('morgan')

const db = require('./database')

const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')
const privateRouter = require('./routes/private')
const raceRouter = require('./routes/race-history')
const client = path.join(__dirname, 'client')
const app = express()

app.use(logger('dev'))
app.use(cors())
app.use(express.json())

app.use('/', express.static(client));

app.use('/', indexRouter)
app.use('/oauth', authRouter)
app.use('/api?', privateRouter)
app.use('/api/race-history', raceRouter)

app.use('/*', function(req, res) {
  res.sendFile(path.join(client, 'index.html'));
})

const listener = app.listen(8080, () => {
  console.log('Listening on port ' + listener.address().port)
})