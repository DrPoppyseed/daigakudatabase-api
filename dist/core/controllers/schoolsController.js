'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.getSchools = void 0
const query_string_1 = __importDefault(require('query-string'))
const schoolsImpl_1 = __importDefault(
  require('../../drivers/databaseImpls/schoolsImpl')
)
const userSchoolLikeImpl_1 = __importDefault(
  require('../../drivers/databaseImpls/userSchoolLikeImpl')
)
const error_1 = require('../../utils/error')
const getSchools = (req, res, next) => {
  const schoolsPerPage = parseInt(process.env.SCHOOLS_PER_PAGE, 10) || 10
  const page = parseInt(req.query.page, 10)
  const token = req.firebaseToken
  const userId = token ? token.user_id : null
  const parsedQuery = query_string_1.default.parse(req.url)
  const mongooseQueries = {}
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
  schoolsImpl_1.default
    .find(mongooseQueries)
    .countDocuments()
    .then(numSchools => {
      totalSchoolsFound = numSchools
      return schoolsImpl_1.default
        .find(mongooseQueries)
        .sort(sort)
        .skip((page - 1) * schoolsPerPage)
        .limit(~~schoolsPerPage)
    })
    .then(schools =>
      __awaiter(void 0, void 0, void 0, function* () {
        if (!schools) {
          throw new error_1.ResourceNotFoundError()
        }
        const awaitSchools = yield Promise.all(
          schools.map(school =>
            __awaiter(void 0, void 0, void 0, function* () {
              return yield userSchoolLikeImpl_1.default
                .exists({
                  userId: userId,
                  ipeds_unitid: school.general.ipeds_unitid,
                })
                .then(result => {
                  console.log(school.general)
                  return Object.assign(Object.assign({}, school.general), {
                    isLiked: result,
                  })
                })
                .catch(err => {
                  console.log(err)
                  if (!err.statusCode) err.statusCode = 500
                  next(err)
                })
            })
          )
        )
        res.status(200).json({
          message: 'Schools fetched!',
          totalSchoolsFound: totalSchoolsFound,
          schools: awaitSchools,
        })
      })
    )
    .catch(err => {
      console.log(err)
      if (!err.statusCode) err.statusCode = 500
      next(err)
    })
}
exports.getSchools = getSchools
//# sourceMappingURL=schoolsController.js.map
