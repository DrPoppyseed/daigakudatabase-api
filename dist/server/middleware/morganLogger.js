"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var morgan_1 = __importDefault(require("morgan"));
var logger_1 = __importDefault(require("../../config/logger"));
var morganLogger = (0, morgan_1.default)(':method :url :status :res[content-length] - :response-time ms', {
    stream: {
        write: function (message) {
            return logger_1.default.http(message.trim());
        },
    },
});
exports.default = morganLogger;
