const queryString = require('query-string')
const Schools = require('../models/schools')
const Majors = require('../models/majors')
const UserSchoolLike = require('../models/userSchoolLike')

exports.getSchools = (req, res, next) => {
  const schoolsPerPage = process.env.SCHOOLS_PER_PAGE || 8
  const page = req.query.page
  const token = req.firebaseToken

  let userId = !!token ? token.user_id : null

  let parsedQuery = queryString.parse(req.url)
  console.log(parsedQuery)

  let query = {}
  let totalSchoolsFound;

  Schools.find(query)
    .countDocuments()
    .then(numSchools => {
      totalSchoolsFound = numSchools
      return Schools.find(query)
        .skip((page - 1) * schoolsPerPage)
        .limit(~~schoolsPerPage)
    })
    .then(async schools => {
      console.log(schools)
      if (!schools) {
        const error = new Error('Failed to fetch schools')
        error.statusCode = 404
        console.log(error)
        throw error
      }

      /** TODO: Enable liking function for schools */
      // let awaitSchools = await Promise.all(
      //   schools.map(async school => {
      //     const temp = await UserSchoolLike.exists({
      //       userId: userId,
      //       school_uuid: school.uuid,
      //     })
      //       .then(result => {
      //         return {...school.general, isLiked: result}
      //       })
      //       .catch(err => {
      //         console.log(err)
      //         if (!err.statusCode) err.statusCode = 500
      //         next(err)
      //       })
      //     return temp
      //   })
      // )

      res.status(200).json({
        message: 'Schools fetched!',
        totalSchoolsFound: totalSchoolsFound,
        schools: schools,
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
