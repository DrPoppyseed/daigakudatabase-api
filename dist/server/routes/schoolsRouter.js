"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var schoolsRouter = express_1.default.Router();
var authenticateJWT_1 = __importDefault(require("../middleware/authenticateJWT"));
var schoolsController_1 = require("../../core/controllers/schoolsController");
schoolsRouter.get('/', authenticateJWT_1.default, schoolsController_1.getSchools);
exports.default = schoolsRouter;
