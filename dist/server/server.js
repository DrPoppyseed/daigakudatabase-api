"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("./app"));
var logger_1 = __importDefault(require("../config/logger"));
app_1.default.listen(process.env.PORT, function () {
    logger_1.default.info("Server is running on port:".concat(process.env.PORT));
});
