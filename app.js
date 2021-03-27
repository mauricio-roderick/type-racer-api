const express = require('express')
const cors = require('cors')
const passport = require('passport')
const logger = require('morgan')
const jwt = require('jsonwebtoken')

const db = require("./database")

const indexRouter = require("./routes/index")
const authRouter = require("./routes/auth")
const privateRouter = require("./routes/private")
const raceRouter = require("./routes/race")

const app = express()

app.use(logger("dev"))
app.use(cors())
app.use(express.json())

app.use("/", indexRouter)
app.use("/oauth", authRouter)
app.use("/private?", privateRouter)
app.use("/private/race", raceRouter)

const listener = app.listen(8080, () => {
  console.log("Listening on port " + listener.address().port)
})