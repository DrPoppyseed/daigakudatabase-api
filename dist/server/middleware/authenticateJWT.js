"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var firebase_admin_1 = __importDefault(require("firebase-admin"));
var authenticateJWT = function (req, res, next) {
    var authHeader = req.headers['authorization'];
    var encodedToken = authHeader && authHeader.split(' ')[1];
    if (encodedToken == null) {
        req.firebaseToken = null; // no token
        next();
    }
    else {
        firebase_admin_1.default
            .auth()
            .verifyIdToken(encodedToken)
            .then(function (decodedToken) {
            req.firebaseToken = decodedToken;
            next();
        })
            .catch(function (err) {
            req.firebaseToken = null;
            next();
        });
    }
};
exports.default = authenticateJWT;
