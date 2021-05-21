require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const favicon = require('serve-favicon')
const admin = require('firebase-admin')
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH)

const usersRoutes = require('./routes/users')
const schoolsRoutes = require('./routes/schools')
const userRoutes = require('./routes/user')

const PORT = 3080
const app = express()
app.use(logger('dev'))
app.use(helmet())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
)
app.use(express.static(__dirname + '/public'))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  )
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  next()
})

app.use((error, req, res, next) => {
  console.log(error)
  const status = error.statusCode || 500
  const message = error.message
  const data = error.data
  res.status(status).json({
    message: message,
    data: data,
  })
})

// app.use('/', (req, res, next) => {
//   res.send('Backend is working!')
// })

app.use('/api/v1/users', usersRoutes)
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/schools', schoolsRoutes)

mongoose
  .connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(result => {
    app.listen(5000)
  })
  .catch(err => console.log(err))
