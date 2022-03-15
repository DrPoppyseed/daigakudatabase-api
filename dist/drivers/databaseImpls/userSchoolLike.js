"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var UserSchoolLikeSchema = new mongoose_1.Schema({
    userId: String,
    ipeds_unitid: String,
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('UserSchoolLike', UserSchoolLikeSchema);
