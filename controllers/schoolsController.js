const _ = require('lodash')

const School = require('../models/school')
const UserSchoolLike = require('../models/userSchoolLike')
const GroupChip = require('../models/groupChip')
const ObjectId = require('mongodb').ObjectId

exports.getSchools = (req, res, next) => {
  /** TODO: refactor this icky code */
  const schoolsPerPage = process.env.SCHOOLS_PER_PAGE || 8
  const page = req.query.page
  const token = req.firebaseToken
  console.log('🚀 ~ file: schoolsController.js ~ line 13 ~ token', token)

  let userId = !!token ? token.user_id : null

  let parseUrl = req.url.split(/&|\?/g)
  let parsedUrlQueries = {}
  let schoolTypes = []
  let yearTypes = []

  if (parseUrl.length > 1) {
    parseUrl.shift()
    parseUrl.map(item => {
      const itemArr = item.split('=')
      const key = itemArr[0]
      const value = itemArr[1]

      if (key.match(/(twoYear|fourYear)/)) {
        let queryYearType = ''
        if (key === 'twoYear') queryYearType = '２年制'
        else if (key === 'fourYear') queryYearType = '４年制'
        yearTypes.push(queryYearType)
      }

      if (
        key.match(
          /(publicSchool|privateSchool|communityCollege|technicalCollege)/
        )
      ) {
        let querySchoolType = ''
        if (key === 'publicSchool') querySchoolType = '公立'
        else if (key === 'privateSchool') querySchoolType = '私立'
        else if (key === 'communityCollege')
          querySchoolType = 'コミュニティカレッジ'
        else if (key === 'technicalCollege') querySchoolType = '専門学校'
        schoolTypes.push(querySchoolType)
      }

      // handle if range item
      else if (key === 'sat') {
        const low = value.split(',')[0]
        const high = value.split(',')[1]
        parsedUrlQueries = {
          ...parsedUrlQueries,
          'institutionData.sat.high': { $lte: ~~high },
          'institutionData.sat.low': { $gte: ~~low },
        }
      } else if (key === 'tuition') {
        const low = value.split(',')[0]
        const high = value.split(',')[1]
        parsedUrlQueries = {
          ...parsedUrlQueries,
          'institutionData.cost.in_state_tuition': { $lte: ~~high },
          'institutionData.out_of_state_tuition': { $gte: ~~low },
        }
      }
      // else if (key === 'toefl') {
      //   parsedUrlQueries = {
      //     ...parsedUrlQueries,
      //     'institutionData.toeflRange': { $gte: ~~value },
      //   }
      // }
      else if (key === 'state') {
        parsedUrlQueries = {
          ...parsedUrlQueries,
          'institutionData.state_postcode': value,
        }
      }
    })
  }

  if (schoolTypes.length === 0) {
    _.omit(parsedUrlQueries, 'institutionData.school_type')
  } else {
    parsedUrlQueries = {
      ...parsedUrlQueries,
      'institutionData.school_type': {
        $in: [...schoolTypes],
      },
    }
  }

  if (yearTypes.length === 0) {
    _.omit(parsedUrlQueries, 'institutionData.year_type')
  } else {
    parsedUrlQueries = {
      ...parsedUrlQueries,
      'institutionData.year_type': {
        $in: [...yearTypes],
      },
    }
  }

  let totalSchoolsFound
  let query = null

  if (Object.keys(parsedUrlQueries).length !== 0) {
    query = parsedUrlQueries != {} && { ...parsedUrlQueries }
  }

  School.find(query)
    .countDocuments()
    .then(numSchools => {
      totalSchoolsFound = numSchools
      return School.find(query)
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
          const temp = await UserSchoolLike.exists({
            userId: userId,
            school_uuid: school.uuid,
          })
            .then(result => {
              return { ...school.institutionData, isLiked: result }
            })
            .catch(err => {
              console.log(err)
              if (!err.statusCode) err.statusCode = 500
              next(err)
            })
          return temp
        })
      )
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

exports.getMyPage = (req, res, next) => {
  const userId = req.body.userId
  const page = req.params.page || 1
  const schoolIds = req.body.schoolIds

  const SCHOOLS_PER_PAGE = 6

  School.find({ opeid6: { $in: [...schoolIds] } })
    .skip((page - 1) * SCHOOLS_PER_PAGE)
    .limit(SCHOOLS_PER_PAGE)
    .then(result => {
      res.status(200).json({
        message: 'Liked schools fetched!',
        schools: result,
      })
    })
    .catch(err => {
      console.log(err)
      if (!err.statusCode) err.statusCode = 500
      next(err)
    })
}

exports.getSchoolById = (req, res, next) => {
  const schoolId = req.params.schoolId
  const token = req.firebaseToken
  console.log('🚀 ~ file: schoolsController.js ~ line 188 ~ token', token)
  let userId = !!token ? token.user_id : null

  School.find({
    'institutionData.url': schoolId,
  })
    .then(async school => {
      const exists = await UserSchoolLike.exists({
        userId: userId,
        school_uuid: school[0].uuid,
      })

      if (exists) {
        res.status(200).json({
          message: 'School report fetched',
          schoolReport: { ...school, isLiked: true },
        })
      } else {
        res.status(200).json({
          message: 'School report fetched',
          schoolReport: { ...school, isLiked: false },
        })
      }
    })
    .catch(err => {
      console.log(err)
      if (!err.statusCode) err.statusCode = 500
      next(err)
    })
}
/** insert json file data to mongodb database */
exports.insertSchools = (req, res, next) => {}
