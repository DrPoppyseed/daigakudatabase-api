"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var authenticateJWT_1 = __importDefault(require("../middleware/authenticateJWT"));
var usersRouter = express_1.default.Router();
var usersController_1 = __importDefault(require("../../core/controllers/usersController"));
usersRouter.put('/', authenticateJWT_1.default, usersController_1.default.signUp);
usersRouter.get('/', authenticateJWT_1.default, usersController_1.default.signIn);
usersRouter.get('/like', authenticateJWT_1.default, usersController_1.default.likeSchool);
usersRouter.get('/unlike', authenticateJWT_1.default, usersController_1.default.unlikeSchool);
exports.default = usersRouter;
