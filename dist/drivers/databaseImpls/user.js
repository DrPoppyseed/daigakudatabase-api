"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var UserSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    emailVerified: {
        type: Boolean,
        required: true,
    },
    thumbnail: {
        type: String,
    },
    profile: {
        userId: mongoose_1.Schema.Types.ObjectId,
        userFirebaseId: String,
        profileStatus: Number,
        imageUrl: String,
        imageThumbUrl: String,
        firstName: String,
        lastName: String,
        profileText: String,
        belongsTo: {
            _id: mongoose_1.Schema.Types.ObjectId,
            name: String,
            email: String,
            emailVerified: String,
            userId: mongoose_1.Schema.Types.ObjectId,
        },
    },
    personalAppState: {
        theme: {
            type: Number,
            required: true,
        },
    },
    likedSchools: [String],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('User', UserSchema);
