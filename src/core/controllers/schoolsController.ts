import queryString from 'query-string'
import SchoolsImpl from '../../drivers/databaseImpls/schoolsImpl'
import UserSchoolLikeImpl from '../../drivers/databaseImpls/userSchoolLikeImpl'
import { NextFunction, Response, Request } from 'express'
import { ResourceNotFoundError } from '../../utils/error'
import { KeyValueObject } from '../../types/common'

export const getSchools = (req: Request, res: Response, next: NextFunction) => {
  const schoolsPerPage: number =
    parseInt(process.env.SCHOOLS_PER_PAGE as string, 10) || 10
  const page: number = parseInt(<string>req.query.page, 10)
  const token = req.firebaseToken

  const userId = token ? token.user_id : null

  const parsedQuery: KeyValueObject = queryString.parse(req.url)

  const mongooseQueries: any = {}
  let totalSchoolsFound: any

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
  const yearsQuery = []
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
  const controlQuery = []
  if (parsedQuery.privateSchool !== undefined) {
    controlQuery.push({
      'general.campus.control': { $regex: 'Private', $options: 'i' },
    })
  }
  if (parsedQuery.publicSchool !== undefined) {
    controlQuery.push({ 'general.campus.control': 'Public' })
  }
  if (controlQuery.length > 0) mongooseQueries['$or'] = controlQuery

  SchoolsImpl.find(mongooseQueries)
    .countDocuments()
    .then(numSchools => {
      totalSchoolsFound = numSchools
      return SchoolsImpl.find(mongooseQueries)
        .sort(sort)
        .skip((page - 1) * schoolsPerPage)
        .limit(~~schoolsPerPage)
    })
    .then(async schools => {
      if (!schools) {
        throw new ResourceNotFoundError()
      }

      const awaitSchools = await Promise.all(
        schools.map(async school => {
          return await UserSchoolLikeImpl.exists({
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
