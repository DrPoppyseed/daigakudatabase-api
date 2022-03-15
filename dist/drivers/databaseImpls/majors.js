"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var MajorsSchema = new mongoose_1.Schema({
    uuid: String,
    opeid: String,
    opeid6: String,
    name_en: String,
    name_jp: String,
    url: String,
    majors: [
        {
            majorCIP: String,
            majorTitle: String,
            majorDesc: String,
            majorTitleJap: String,
            majorDescJap: String,
            programsPerCredLevInDept: {
                1: Number,
                2: Number,
                3: Number,
                4: Number,
                5: Number,
                6: Number,
                7: Number,
                8: Number,
            },
            programs: [
                {
                    code: String,
                    codeFull: String,
                    name: String,
                    credLev: String,
                    credDesc: String,
                    credDescJap: String,
                    graduates: String,
                    medianIncome1: String,
                    medianIncome2: String,
                    nameJap: String,
                    descJap: String,
                },
            ],
        },
    ],
    programsPerCredLev: {
        1: Number,
        2: Number,
        3: Number,
        4: Number,
        5: Number,
        6: Number,
        7: Number,
        8: Number,
    },
});
exports.default = (0, mongoose_1.model)('Majors', MajorsSchema);
