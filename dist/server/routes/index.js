"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var schoolsRouter_1 = __importDefault(require("./schoolsRouter"));
var userRouter_1 = __importDefault(require("./userRouter"));
var usersRouter_1 = __importDefault(require("./usersRouter"));
var routes = (0, express_1.Router)();
routes.use('/api/v1/user', userRouter_1.default);
routes.use('/api/v1/users', usersRouter_1.default);
routes.use('/api/v1/schools', schoolsRouter_1.default);
exports.default = routes;
