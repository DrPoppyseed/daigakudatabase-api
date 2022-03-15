"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var winston_1 = __importDefault(require("winston"));
var _a = winston_1.default.format, combine = _a.combine, printf = _a.printf, align = _a.align, timestamp = _a.timestamp, colorize = _a.colorize;
var logger = winston_1.default.createLogger({
    level: 'http',
    format: combine(colorize({ all: true }), timestamp({
        format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }), align(), printf(function (info) { return "[".concat(info.timestamp, "] ").concat(info.level, ": ").concat(info.message); })),
    transports: [new winston_1.default.transports.Console()],
});
exports.default = logger;
