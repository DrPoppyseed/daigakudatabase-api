"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNumberIfNumeric = exports.isStringNumeric = void 0;
var isStringNumeric = function (str) {
    if (typeof str != 'string')
        return false;
    // @ts-ignore
    // We need to use type-coercion here, much to our dismay
    return !isNaN(str) && !isNaN(parseFloat(str));
};
exports.isStringNumeric = isStringNumeric;
var toNumberIfNumeric = function (raw) {
    if (typeof raw === 'number')
        return raw;
    else if (typeof raw === 'string' && (0, exports.isStringNumeric)(raw))
        return parseInt(raw, 10);
    else
        return null;
};
exports.toNumberIfNumeric = toNumberIfNumeric;
