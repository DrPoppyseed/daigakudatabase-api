const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schoolsSchema = new Schema({
  general: {
    name_en: String,
    ff_name: String,
    forbes_desc: String,
    forbes_uri: String,
    ipeds_unitid: String,
    opeid: String,
    opeid6: String,
    local_url: String,
    aliases: [String],
    unique_flags: [String],
    campus: {
      address: String,
      address_short: String,
      bea_regions: String,
      city: String,
      control: String,
      county: String,
      geolocation: {
        longitude: Number,
        latitude: Number
      },
      religious_affiliates: String,
      school_system: String,
      state: String,
      state_postid: String,
      urbanization_level: String,
      zip: String
    },
    admissions: {
      act: {
        comp_25th_percentile: Number,
        comp_75th_percentile: Number,
        eng_25th_percentile: Number,
        eng_75th_percentile: Number,
        math_25th_percentile: Number,
        math_75th_percentile: Number
      },
      sat: {
        eng_25th_percentile: Number,
        eng_75th_percentile: Number,
        math_25th_percentile: Number,
        math_75th_percentile: Number
      },
      population: {
        admitted_men: Number,
        admitted_women: Number,
        admitted_total: Number,
        applicants_men: Number,
        applicants_women: Number,
        applicants_total: Number,
        enrolled_men: Number,
        enrolled_women: Number,
        enrolled_total: Number,
        num_submitting_act: Number,
        num_submitting_sat: Number,
        percent_submitting_act: Number,
        percent_submitting_sat: Number
      },
      requirements: {
        admission_test_scores: Boolean,
        college_preparatory_programs: Boolean,
        formal_demonstration: Boolean,
        gpa: Boolean,
        other_tests: Boolean,
        recommendation_letters: Boolean,
        school_rank: Boolean,
        school_record: Boolean,
        toefl: Boolean
      },
      undergrad_application_fee: Number
    },
    classifications: {
      carnegie_classification: String,
      carnegie_size_category: String
    },
    education: {
      calendar_system: String,
      program_sizes: Object,
    },
    faculty: {
      breakdown_by_rank: {
        assistant_professors: Number,
        associate_professors: Number,
        other: Number,
        professors: Number
      },
      fulltime_instructional_staff: Number
    },
    housing: {
      board_meal_plan: Boolean,
      meals_per_week_in_board: Number,
      oncampus_dorm_capacity: Number,
      provides_oncampus_housing: Boolean,
      yearly_board_charge: Number,
      yearly_room_and_board_charge: Number,
      yearly_room_charge: Number
    },
    library: {
      digital_books: Number,
      digital_databases: Number,
      digital_media: Number,
      physical_books: Number,
      physical_media: Number
    },
    official_resources: {
      admissions: String,
      financial_aid: String,
      homepage: String,
      net_price_calculator: String,
      online_applications: String
    },
    sports: {
      athletic_organizations: [String],
      is_member_of_naa: Boolean
    },
    students: {
      fulltime_retention_rate: Number,
      institution_size_category: String,
      student_faculty_ratio: Number,
      enrollment: {
        demographics: {
          asian: Number,
          black: Number,
          hispanic: Number,
          international: Number,
          other: Number,
          white: Number
        },
        entry_age_avg: Number,
        men: Number,
        women: Number,
        size: String
      },
      headcount: {
        total_men: Number,
        total_women: Number,
        breakdown_by_race: {
          american_indian_or_alaska_native: Number,
          asian: Number,
          black_or_african_american: Number,
          hispanic_or_latino: Number,
          native_hawaiian_or_other_pacific_islander: Number,
          two_or_more: Number,
          white: Number
        },
        breakdown_by_race_and_sex: {
          american_indian_or_alaska_native_men: Number,
          american_indian_or_alaska_native_women: Number,
          asian_men: Number,
          asian_women: Number,
          black_or_african_american_men: Number,
          black_or_african_american_women: Number,
          hispanic_or_latino_men: Number,
          hispanic_or_latino_women: Number,
          native_hawaiian_or_other_pacific_islander_men: Number,
          native_hawaiian_or_other_pacific_islander_women: Number,
          two_or_more_men: Number,
          two_or_more_women: Number,
          white_men: Number,
          white_women: Number
        },
      }
    },
    tuition: {
      books_and_supplies: {
        '2017': Number,
        '2018': Number,
        '2019': Number
      },
      in_state: {
        '2017': {
          fees: Number,
          tuition: Number,
          tuition_and_fees: Number
        },
        '2018': {
          fees: Number,
          tuition: Number,
          tuition_and_fees: Number
        },
        '2019': {
          fees: Number,
          tuition: Number,
          tuition_and_fees: Number
        }
      },
      out_of_state: {
        '2017': {
          fees: Number,
          tuition: Number,
          tuition_and_fees: Number
        },
        '2018': {
          fees: Number,
          tuition: Number,
          tuition_and_fees: Number
        },
        '2019': {
          fees: Number,
          tuition: Number,
          tuition_and_fees: Number
        },
      },
      on_campus: {
        '2017': {
          other_expenses: Number,
          room_and_board_on_campus: Number
        },
        '2018': {
          other_expenses: Number,
          room_and_board_on_campus: Number
        },
        '2019': {
          other_expenses: Number,
          room_and_board_on_campus: Number
        },
      },
      off_campus: {
        '2017': {
          other_expenses_off_campus: Number,
          room_and_board_off_campus: Number
        },
        '2018': {
          other_expenses_off_campus: Number,
          room_and_board_off_campus: Number
        },
        '2019': {
          other_expenses_off_campus: Number,
          room_and_board_off_campus: Number
        },
      }
    }
  },
  rankings: Object
})

module.exports = mongoose.model('Schools', schoolsSchema)
