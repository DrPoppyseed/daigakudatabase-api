export type School = {
  general: {
    name_en: string
    ff_name: string
    forbes_desc: string
    forbes_uri: string
    ipeds_unitid: string
    opeid: string
    opeid6: string
    local_url: string
    aliases: string[]
    unique_flags: string[]
    campus: Campus
    admissions: Admissions
    classifications: Classifications
    education: Education
    faculty: Faculty
    housing: Housing
    library: Library
    official_resources: OfficialResources
    sports: Sports
    students: Students
    tuition: Tuition
  }
  rankings: object
}

export type Campus = {
  address: string
  address_short: string
  bea_regions: string
  city: string
  control: string
  county: string
  geolocation: Geolocation
  religious_affiliates: string
  school_system: string
  state: string
  state_postid: string
  urbanization_level: string
  zip: string
}

export type GeoLocation = {
  longitude: number
  latitude: number
}

export type Admissions = {
  act: AdmissionsACT
  sat: AdmissionsSAT
  population: AdmissionsPopulation
  requirements: Requirements
  undergrad_application_fee: number
}

export type AdmissionsACT = {
  comp_25th_percentile: number
  comp_75th_percentile: number
  eng_25th_percentile: number
  eng_75th_percentile: number
  math_25th_percentile: number
  math_75th_percentile: number
}

export type AdmissionsSAT = {
  eng_25th_percentile: number
  eng_75th_percentile: number
  math_25th_percentile: number
  math_75th_percentile: number
}

export type AdmissionsPopulation = {
  admitted_men: any
  admitted_women: any
  admitted_total: any
  applicants_men: any
  applicants_women: any
  applicants_total: any
  enrolled_men: any
  enrolled_women: any
  enrolled_total: any
  num_submitting_act: any
  num_submitting_sat: any
  percent_submitting_act: any
  percent_submitting_sat: any
}

export type Requirements = {
  admission_test_scores: boolean
  college_preparatory_programs: boolean
  formal_demonstration: boolean
  gpa: boolean
  other_tests: boolean
  recommendation_letters: boolean
  school_rank: boolean
  school_record: boolean
  toefl: boolean
}

export type Classifications = {
  carnegie_classification: string
  carnegie_size_category: string
}

export type Education = {
  calendar_system: string
  program_sizes: object
}

export type Faculty = {
  breakdown_by_rank: {
    assistant_professors: number
    associate_professors: number
    other: number
    professors: number
  }
  fulltime_instructional_staff: number
}

export type Housing = {
  board_meal_plan: boolean
  meals_per_week_in_board: number
  oncampus_dorm_capacity: number
  provides_oncampus_housing: boolean
  yearly_board_charge: number
  yearly_room_and_board_charge: number
  yearly_room_charge: number
}

export type Library = {
  digital_books: number
  digital_databases: number
  digital_media: number
  physical_books: number
  physical_media: number
}

export type OfficialResources = {
  admissions: string
  financial_aid: string
  homepage: string
  net_price_calculator: string
  online_applications: string
}

export type Sports = {
  athletic_organizations: string[]
  is_member_of_naa: boolean
}

export type Students = {
  fulltime_retention_rate: any
  institution_size_category: string
  student_faculty_ratio: any
  enrollment: {
    demographics: StudentEnrollmentDemographics
    entry_age_avg: number
    men: number
    women: number
    size: string
  }
  headcount: {
    total_men: number
    total_women: number
    breakdown_by_race: StudentBreakdownByRace
    breakdown_by_race_and_sex: StudentBreakdownBySex
  }
}

export type StudentEnrollmentDemographics = {
  asian: number
  black: number
  hispanic: number
  international: number
  other: number
  white: number
}

export type StudentBreakdownByRace = {
  american_indian_or_alaska_native: number
  asian: number
  black_or_african_american: number
  hispanic_or_latino: number
  native_hawaiian_or_other_pacific_islander: number
  two_or_more: number
  white: number
}

export type StudentBreakdownBySex = {
  american_indian_or_alaska_native_men: number
  american_indian_or_alaska_native_women: number
  asian_men: number
  asian_women: number
  black_or_african_american_men: number
  black_or_african_american_women: number
  hispanic_or_latino_men: number
  hispanic_or_latino_women: number
  native_hawaiian_or_other_pacific_islander_men: number
  native_hawaiian_or_other_pacific_islander_women: number
  two_or_more_men: number
  two_or_more_women: number
  white_men: number
  white_women: number
}

export type Years = '2017' | '2018' | '2019'

export type TuitionByYear = {
  fees: any
  tuition: any
  tuition_and_fees: any
}

export type Tuition = {
  books_and_supplies: {
    Years: any
  }
  in_state: {
    Years: TuitionByYear
  }
  out_of_state: {
    Years: TuitionByYear
  }
  on_campus: {
    Years: {
      other_expenses: any
      room_and_board_on_campus: any
    }
  }
  off_campus: {
    Years: {
      other_expenses_off_campus: any
      room_and_board_off_campus: any
    }
  }
}
