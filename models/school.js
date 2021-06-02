const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schoolSchema = new Schema({
  uuid: String,
  opeid: String,
  opeid6: String,
  name_en: String,
  name_jp: String,
  institutionData: {
    uuid: String,
    name_en: String,
    name_jp: String,
    card_img_src: String,
    card_img_alt: String,
    page_img_src: String,
    page_img_alt: String,
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
    location: { lat: Number, lon: Number },
    unique_flags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'GroupChip',
      },
    ],
    admission_rate: Number,
    sat: { low: Number, average: Number, high: Number },
    cost: {
      academic_year_avg: String,
      in_state_tuition: String,
      out_of_state_tuition: String,
    },
    students: {
      size: String,
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
  majors: [
    {
      majorCIP: String,
      majorTitle: String,
      majorDesc: String,
      majorTitleJap: String,
      majorDescJap: String,
      programsPerCredLevInDept: {
        1: Number,
        2: Number,
        3: Number,
        4: Number,
        5: Number,
        6: Number,
        7: Number,
        8: Number,
      },
      programs: [
        {
          code: String,
          codeFull: String,
          name: String,
          credLev: String,
          credDesc: String,
          credDescJap: String,
          graduates: String,
          medianIncome1: String,
          medianIncome2: String,
          nameJap: String,
          descJap: String,
        },
      ],
    },
  ],
  programsPerCredLev: {
    1: Number,
    2: Number,
    3: Number,
    4: Number,
    5: Number,
    6: Number,
    7: Number,
    8: Number,
  },
})

module.exports = mongoose.model('School', schoolSchema)
