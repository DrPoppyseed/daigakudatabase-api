const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchoolLikeSchema = new Schema(
  {
    userId: String,
    school_uuid: String,
  },
  { timestamps: true }
)

module.exports = mongoose.model('UserSchoolLike', userSchoolLikeSchema)
