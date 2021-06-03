const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schoolsSchema = new Schema({
  uuid: String,
  opeid: String,
  opeid6: String,
  name_en: String,
  name_jp: String,
  institutionData: {
    uuid: String,
    unitid: String,
    name_en: String,
    name_jp: String,
    card_img_srcs_jpeg: [String],
    card_img_srcs_webp: [String],
    page_img_srcs_jpeg: [String],
    page_img_srcs_webp: [String],
    mini_img_srcs_jpeg: [String],
    mini_img_srcs_webp: [String],
    card_img_alts: [String],
    page_img_alts: [String],
    mini_img_alts: [String],
    url: String,
    school_homepage_url: String,
    price_calculator_url: String,
    state_jp: String,
    state_en: String,
    state_postcode: String,
    city: String,
    campus_address_short: String,
    year_type: String,
    school_type: String,
    rating_score: Number,
    ratings: Number,
    summary: String,
    location: { lat: String, lon: String },
    unique_flags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'GroupChip',
      },
    ],
    admission_rate: Number,
    sat: { low: Number, average: Number, high: Number },
    cost: {
      academic_year_avg: Number,
      in_state_tuition: Number,
      out_of_state_tuition: Number,
    },
    students: {
      size: Number,
      men: Number,
      women: Number,
      entry_age_avg: Number,
      demographics: {
        white: Number,
        black: Number,
        hispanic: Number,
        asian: Number,
        international: Number,
        other: Number,
      },
    },
  },
})

module.exports = mongoose.model('Schools', schoolsSchema)
