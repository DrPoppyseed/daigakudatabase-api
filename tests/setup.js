jest.setTimeout(30000)

require('../models/school')
require('../models/user')
require('../models/userSchoolLike')

const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/', )