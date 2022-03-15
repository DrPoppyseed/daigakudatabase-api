"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var handleError_1 = __importDefault(require("./middleware/handleError"));
var routes_1 = __importDefault(require("./routes"));
var mongodb_1 = __importDefault(require("../config/mongodb"));
var express_1 = __importDefault(require("express"));
var helmet_1 = __importDefault(require("helmet"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var morgan_1 = __importDefault(require("morgan"));
var firebase_admin_1 = __importDefault(require("firebase-admin"));
var express_rate_limit_1 = __importDefault(require("express-rate-limit"));
var cors_1 = __importDefault(require("cors"));
var morganLogger_1 = __importDefault(require("./middleware/morganLogger"));
dotenv_1.default.config();
var app = (0, express_1.default)();
app.set('trust proxy', 1);
var limiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW),
    max: parseInt(process.env.RATE_LIMIT_MAX),
});
app.use(limiter);
app.use((0, morgan_1.default)('dev'));
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: true,
    secure: process.env.NODE_ENV !== 'development',
}));
app.use((0, cookie_parser_1.default)());
app.use(morganLogger_1.default);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('public'));
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(JSON.parse(process.env.FIREBASE_SA_CREDENTIALS)),
});
(0, mongodb_1.default)()
    .then(function () {
    app.use(routes_1.default);
    app.use(handleError_1.default);
    app.get('/', function (req, res) {
        morgan_1.default.info('Console is working properly!');
        res.status(200).send('Server is running!');
    });
})
    .catch(function (error) {
    morgan_1.default.error(error);
});
exports.default = app;
