"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchools = void 0;
var query_string_1 = __importDefault(require("query-string"));
var schoolsImpl_1 = __importDefault(require("../../drivers/databaseImpls/schoolsImpl"));
var userSchoolLikeImpl_1 = __importDefault(require("../../drivers/databaseImpls/userSchoolLikeImpl"));
var getSchools = function (req, res, next) {
    var schoolsPerPage = process.env.SCHOOLS_PER_PAGE || 10;
    var page = req.query.page;
    var token = req.firebaseToken;
    var userId = !!token ? token.user_id : null;
    var parsedQuery = query_string_1.default.parse(req.url);
    var mongooseQueries = {};
    var totalSchoolsFound;
    // exclude null values when sorting (except when default)
    var sort = {};
    if (parsedQuery.sortby === 'sat-ascending') {
        mongooseQueries['general.admissions.sat.total_75th_percentile'] = {
            $nin: [null, '-'],
        };
        sort = { 'general.admissions.sat.total_75th_percentile': 1 };
    }
    else if (parsedQuery.sortby === 'sat-descending') {
        mongooseQueries['general.admissions.sat.total_75th_percentile'] = {
            $nin: [null, '-'],
        };
        sort = { 'general.admissions.sat.total_75th_percentile': -1 };
    }
    else if (parsedQuery.sortby === 'tuition-ascending') {
        mongooseQueries['general.tuition.out_of_state.2019.tuition'] = {
            $nin: [null, '-'],
        };
        sort = { 'general.tuition.out_of_state.2019.tuition': 1 };
    }
    else if (parsedQuery.sortby === 'tuition-descending') {
        mongooseQueries['general.tuition.out_of_state.2019.tuition'] = {
            $nin: [null, '-'],
        };
        sort = { 'general.tuition.out_of_state.2019.tuition': -1 };
    }
    // - state
    if (parsedQuery.state !== undefined) {
        mongooseQueries['general.campus.state_postid'] = parsedQuery.state;
    }
    // - urban
    if (parsedQuery.urban !== undefined) {
        mongooseQueries['general.campus.urbanization_level'] = {
            $regex: "".concat(parsedQuery.urban
                .charAt(0)
                .toUpperCase()).concat(parsedQuery.urban.slice(1)),
            $options: 'i',
        };
    }
    // - tuition
    if (parsedQuery.tuition !== '0,60000') {
        var tuitionStr = parsedQuery.tuition.split(',');
        mongooseQueries['general.tuition.out_of_state.2019.tuition'] = {
            $gte: ~~tuitionStr[0],
            $lte: ~~tuitionStr[1],
        };
    }
    // - sat
    if (parsedQuery.sat !== undefined) {
        var satStr = parsedQuery.sat.split(',');
        mongooseQueries['general.admissions.sat.total_75th_percentile'] = {
            $gte: ~~satStr[0],
            $lte: ~~satStr[1],
        };
    }
    // - year-type
    var yearsQuery = [];
    if (parsedQuery.fourYear !== undefined) {
        yearsQuery.push({
            'general.classifications.carnegie_size_category': {
                $regex: 'Four-year',
                $options: 'i',
            },
        });
    }
    if (parsedQuery.twoYear !== undefined) {
        yearsQuery.push({
            'general.classifications.carnegie_size_category': {
                $regex: 'Two-year',
                $options: 'i',
            },
        });
    }
    if (yearsQuery.length > 0)
        mongooseQueries['$or'] = yearsQuery;
    // - control
    var controlQuery = [];
    if (parsedQuery.privateSchool !== undefined) {
        controlQuery.push({
            'general.campus.control': { $regex: 'Private', $options: 'i' },
        });
    }
    if (parsedQuery.publicSchool !== undefined) {
        controlQuery.push({ 'general.campus.control': 'Public' });
    }
    if (controlQuery.length > 0)
        mongooseQueries['$or'] = controlQuery;
    schoolsImpl_1.default.find(mongooseQueries)
        .countDocuments()
        .then(function (numSchools) {
        totalSchoolsFound = numSchools;
        return schoolsImpl_1.default.find(mongooseQueries)
            .sort(sort)
            .skip((page - 1) * schoolsPerPage)
            .limit(~~schoolsPerPage);
    })
        .then(function (schools) { return __awaiter(void 0, void 0, void 0, function () {
        var error, awaitSchools;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!schools) {
                        error = new Error('Failed to fetch schools');
                        error.statusCode = 404;
                        console.log(error);
                        throw error;
                    }
                    return [4 /*yield*/, Promise.all(schools.map(function (school) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, userSchoolLikeImpl_1.default.exists({
                                            userId: userId,
                                            ipeds_unitid: school.general.ipeds_unitid,
                                        })
                                            .then(function (result) {
                                            console.log(school.general);
                                            return __assign(__assign({}, school.general), { isLiked: result });
                                        })
                                            .catch(function (err) {
                                            console.log(err);
                                            if (!err.statusCode)
                                                err.statusCode = 500;
                                            next(err);
                                        })];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); }))];
                case 1:
                    awaitSchools = _a.sent();
                    res.status(200).json({
                        message: 'Schools fetched!',
                        totalSchoolsFound: totalSchoolsFound,
                        schools: awaitSchools,
                    });
                    return [2 /*return*/];
            }
        });
    }); })
        .catch(function (err) {
        console.log(err);
        if (!err.statusCode)
            err.statusCode = 500;
        next(err);
    });
};
exports.getSchools = getSchools;
