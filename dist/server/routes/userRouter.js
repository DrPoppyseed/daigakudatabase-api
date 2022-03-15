"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var userSchoolLikeController_1 = __importDefault(require("../../core/controllers/userSchoolLikeController"));
var userSchoolLikeImpl_1 = __importDefault(require("../../drivers/databaseImpls/userSchoolLikeImpl"));
var userRouter = express_1.default.Router();
var userSchoolLikeController = new userSchoolLikeController_1.default(userSchoolLikeImpl_1.default);
userRouter.get('/likes', userSchoolLikeController.getUserLikes);
exports.default = userRouter;
