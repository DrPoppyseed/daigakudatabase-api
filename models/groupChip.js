const mongoose = require('mongoose')
const Schema = mongoose.Schema

const groupChipSchema = new Schema({
  name: String,
  description: String,
  imgSrc: String,
  imgAlt: String,
  color: String,
  schools: [
    {
      type: Schema.Types.ObjectId,
      ref: 'School',
    },
  ],
})

module.exports = mongoose.model('GroupChip', groupChipSchema)
