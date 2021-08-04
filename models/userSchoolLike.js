const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchoolLikeSchema = new Schema(
  {
    userId: String,
    ipeds_unitid: String,
  },
  { timestamps: true }
)

module.exports = mongoose.model('UserSchoolLike', userSchoolLikeSchema)
