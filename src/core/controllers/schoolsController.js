const queryString = require('query-string')
const Schools = require('../../models/schools')
const Majors = require('../../models/majors')
const UserSchoolLike = require('../../models/userSchoolLike')

exports.getSchools = (req, res, next) => {
  const schoolsPerPage = process.env.SCHOOLS_PER_PAGE || 10
  const page = req.query.page
  const token = req.firebaseToken

  let userId = !!token ? token.user_id : null

  let parsedQuery = queryString.parse(req.url)

  let mongooseQueries = {}
  let totalSchoolsFound

  // exclude null values when sorting (except when default)
  let sort = {}
  if (parsedQuery.sortby === 'sat-ascending') {
    mongooseQueries['general.admissions.sat.total_75th_percentile'] = {
      $nin: [null, '-'],
    }
    sort = { 'general.admissions.sat.total_75th_percentile': 1 }
  } else if (parsedQuery.sortby === 'sat-descending') {
    mongooseQueries['general.admissions.sat.total_75th_percentile'] = {
      $nin: [null, '-'],
    }
    sort = { 'general.admissions.sat.total_75th_percentile': -1 }
  } else if (parsedQuery.sortby === 'tuition-ascending') {
    mongooseQueries['general.tuition.out_of_state.2019.tuition'] = {
      $nin: [null, '-'],
    }
    sort = { 'general.tuition.out_of_state.2019.tuition': 1 }
  } else if (parsedQuery.sortby === 'tuition-descending') {
    mongooseQueries['general.tuition.out_of_state.2019.tuition'] = {
      $nin: [null, '-'],
    }
    sort = { 'general.tuition.out_of_state.2019.tuition': -1 }
  }

  // - state
  if (parsedQuery.state !== undefined) {
    mongooseQueries['general.campus.state_postid'] = parsedQuery.state
  }
  // - urban
  if (parsedQuery.urban !== undefined) {
    mongooseQueries['general.campus.urbanization_level'] = {
      $regex: `${parsedQuery.urban
        .charAt(0)
        .toUpperCase()}${parsedQuery.urban.slice(1)}`,
      $options: 'i',
    }
  }
  // - tuition
  if (parsedQuery.tuition !== '0,60000') {
    const tuitionStr = parsedQuery.tuition.split(',')
    mongooseQueries['general.tuition.out_of_state.2019.tuition'] = {
      $gte: ~~tuitionStr[0],
      $lte: ~~tuitionStr[1],
    }
  }
  // - sat
  if (parsedQuery.sat !== undefined) {
    const satStr = parsedQuery.sat.split(',')
    mongooseQueries['general.admissions.sat.total_75th_percentile'] = {
      $gte: ~~satStr[0],
      $lte: ~~satStr[1],
    }
  }
  // - year-type
  let yearsQuery = []
  if (parsedQuery.fourYear !== undefined) {
    yearsQuery.push({
      'general.classifications.carnegie_size_category': {
        $regex: 'Four-year',
        $options: 'i',
      },
    })
  }
  if (parsedQuery.twoYear !== undefined) {
    yearsQuery.push({
      'general.classifications.carnegie_size_category': {
        $regex: 'Two-year',
        $options: 'i',
      },
    })
  }
  if (yearsQuery.length > 0) mongooseQueries['$or'] = yearsQuery
  // - control
  let controlQuery = []
  if (parsedQuery.privateSchool !== undefined) {
    controlQuery.push({
      'general.campus.control': { $regex: 'Private', $options: 'i' },
    })
  }
  if (parsedQuery.publicSchool !== undefined) {
    controlQuery.push({ 'general.campus.control': 'Public' })
  }
  if (controlQuery.length > 0) mongooseQueries['$or'] = controlQuery

  Schools.find(mongooseQueries)
    .countDocuments()
    .then(numSchools => {
      totalSchoolsFound = numSchools
      return Schools.find(mongooseQueries)
        .sort(sort)
        .skip((page - 1) * schoolsPerPage)
        .limit(~~schoolsPerPage)
    })
    .then(async schools => {
      if (!schools) {
        const error = new Error('Failed to fetch schools')
        error.statusCode = 404
        console.log(error)
        throw error
      }

      let awaitSchools = await Promise.all(
        schools.map(async school => {
          return await UserSchoolLike.exists({
            userId: userId,
            ipeds_unitid: school.general.ipeds_unitid,
          })
            .then(result => {
              console.log(school.general)
              return { ...school.general, isLiked: result }
            })
            .catch(err => {
              console.log(err)
              if (!err.statusCode) err.statusCode = 500
              next(err)
            })
        })
      )

      console.log(awaitSchools)

      res.status(200).json({
        message: 'Schools fetched!',
        totalSchoolsFound: totalSchoolsFound,
        schools: awaitSchools,
      })
    })
    .catch(err => {
      console.log(err)
      if (!err.statusCode) err.statusCode = 500
      next(err)
    })
}

// exports.getMyPage = (req, res, next) => {
//   const userId = req.body.userId
//   const page = req.params.page || 1
//   const schoolIds = req.body.schoolIds
//
//   const SCHOOLS_PER_PAGE = 6
//
//   Schools.find({ opeid6: { $in: [...schoolIds] } })
//     .skip((page - 1) * SCHOOLS_PER_PAGE)
//     .limit(SCHOOLS_PER_PAGE)
//     .then(result => {
//       res.status(200).json({
//         message: 'Liked schools fetched!',
//         schools: result,
//       })
//     })
//     .catch(err => {
//       console.log(err)
//       if (!err.statusCode) err.statusCode = 500
//       next(err)
//     })
// }
//
// exports.getSchoolById = (req, res, next) => {
//   const schoolId = req.params.schoolId
//   const token = req.firebaseToken
//   console.log('🚀 ~ file: schoolsController.js ~ line 188 ~ token', token)
//   let userId = !!token ? token.user_id : null
//
//   Schools.find({
//     'institutionData.url': schoolId,
//   })
//     .then(async school => {
//       const exists = await UserSchoolLike.exists({
//         userId: userId,
//         school_uuid: school[0].uuid,
//       })
//
//       if (exists) {
//         res.status(200).json({
//           message: 'School report fetched',
//           schoolReport: { ...school, isLiked: true },
//         })
//       } else {
//         res.status(200).json({
//           message: 'School report fetched',
//           schoolReport: { ...school, isLiked: false },
//         })
//       }
//     })
//     .catch(err => {
//       console.log(err)
//       if (!err.statusCode) err.statusCode = 500
//       next(err)
//     })
// }
//
// exports.getMajorsById = (req, res, next) => {
//   const schoolId = req.params.schoolId
//   // schoolId for getMajorsById is uuid
//   Majors.findOne({ uuid: schoolId })
//     .then(async majors => {
//       res.status(200).json({
//         message: 'Majors fetched',
//         majors: majors,
//       })
//     })
//     .catch(err => {
//       console.log(err)
//       if (!err.statusCode) err.statusCode = 500
//       next(err)
//     })
// }
