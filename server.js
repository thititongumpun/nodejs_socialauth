//modules
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const mongoose = require('mongoose')
const morgan = require('morgan')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const flash = require('connect-flash')

//db
const configDB = require('./config/database')
mongoose.connect(configDB.url)


//express set up
app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//set templates
app.set('view engine', 'ejs')

//set passport
app.use(session({
    secret: 'iloveyouallintheworld',
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//load routes and pass in passport config
require('./app/routes')(app, passport)

app.listen(port, () => {
    console.log('server listening on port 3000')
})

