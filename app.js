require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const favicon = require('serve-favicon')
const admin = require('firebase-admin')

const usersRoutes = require('./routes/users')
const schoolsRoutes = require('./routes/schools')
const userRoutes = require('./routes/user')

const PORT = process.env.PORT || 5000
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

const serviceAccount = process.env.FIREBASE_SA_CREDENTIALS

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccount)),
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
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Is-Google-SignIn'
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
    app.listen(PORT)
  })
  .catch(err => console.log(err))
