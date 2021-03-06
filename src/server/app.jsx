'use strict'
require('dotenv').config()
const express = require('express')
const passport = require('passport')
const passportSetup = require('./utils/passportSetup')
const routes = require('./routes')
const mongoose = require('mongoose')
const compression = require('compression')
const throttle = require('./throttler')
const favicon = require('serve-favicon')
mongoose.Promise = global.Promise

//configure passport strategy and serializations
passportSetup(passport)

//create new express application
const app = express()

//connect to database
console.log('requesting connection to database...')
mongoose.connect(process.env.MONGOLAB_URI, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useMongoClient: true
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('[almavlaste] connected to database')
  //configure view engine to render handlebars templates
  app.set('view engine', 'hbs')

  // Use application-level middleware for common functionality, including
  // logging, parsing, and session handling.
  app.use(require('morgan')('dev'))
  app.use(require('cookie-parser')())
  app.use(compression())
  // configure limits:
  //app.use('/api/', throttler)
  app.use(throttle(function(req, res, hits, remaining) {
    const until = new Date((new Date()).getTime() + remaining)
    res.statusCode = 420
    res.send('You shall not pass ' + hits + ' until ' + until + '!')
  }))
  //app.use('/api/', throttler({ rateLimit: { ttl: 600, max: 5 } }))
  // Optionally configure a custom limit handler:
  // app.use('/api/', throttle(function(req, res, hits, remaining) {
  //     const until = new Date((new Date()).getTime() + remaining)
  //     res.statusCode = 420
  //     res.send('You shall not pass ' + hits + ' until ' + until + '!')
  // }))
  app.use(require('body-parser').urlencoded({extended: true}))
  //save cookie sessions to the db
  const ditcu_lenupikta = 60 * 60 * 24 * 7
  app.set('trust proxy', 1)
  app.use(require('express-session')({
    secret: '.i do la almavlaste ba pinfu',
    resave: false,
    saveUninitialized: false,
    key: 'sid',
    cookie: {
      secure: true,
      maxAge: 1000 * ditcu_lenupikta // 1 week
    },
    store: new (require('./utils/express-pikta.js'))({
        storage: 'mongodb',
        instance: mongoose,
        // host: 'localhost',
        // port: 27017,
        // db: 'test',
        collection: 'pikta',
        expire: ditcu_lenupikta // optional
    })
    // ,
    // Boilerplate options, see:
    // * https://www.npmjs.com/package/express-session#resave
    // * https://www.npmjs.com/package/express-session#saveuninitialized
    // resave: true,
    // saveUninitialized: true
  }))

  app.use(express.static(__dirname + '/../client/public'))
  app.use(favicon(__dirname + '/../client/public/img/favicon.png'))

  // Initialize Passport and restore authentication state, if any, from the
  // session.
  app.use(passport.initialize())
  app.use(passport.session())

  routes(app, passport)

  //start listening for requests
  const port = process.env.PORT || 3000
  app.listen(port, function() {
    console.log('listening on port ' + port + '...')
  })
})

module.exports = app
