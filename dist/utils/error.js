"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessage = exports.BadValueError = exports.MissingTokenError = exports.BadRequestError = exports.InternalError = exports.ForbiddenError = exports.ResourceNotFoundError = exports.SyntheticError = void 0;
var constants_1 = require("./constants");
var common_1 = require("./common");
var SyntheticError = /** @class */ (function (_super) {
    __extends(SyntheticError, _super);
    function SyntheticError(statusCode, message) {
        var _this = _super.call(this, message) || this;
        _this.name = _this.constructor.name;
        _this._statusCode = _this.initStatusCode(statusCode);
        _this._message = _this.initMessage(message);
        Error.captureStackTrace(_this, _this.constructor);
        return _this;
    }
    Object.defineProperty(SyntheticError.prototype, "statusCode", {
        get: function () {
            return this._statusCode;
        },
        set: function (value) {
            this._statusCode = (0, common_1.toNumberIfNumeric)(value) || 500;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SyntheticError.prototype, "message", {
        set: function (value) {
            this._message = value;
        },
        enumerable: false,
        configurable: true
    });
    SyntheticError.prototype.initStatusCode = function (value) {
        return (0, common_1.toNumberIfNumeric)(value) || 500;
    };
    SyntheticError.prototype.initMessage = function (value) {
        return value || constants_1.INTERNAL_SERVER_ERROR_MESSAGE;
    };
    return SyntheticError;
}(Error));
exports.SyntheticError = SyntheticError;
var ResourceNotFoundError = /** @class */ (function (_super) {
    __extends(ResourceNotFoundError, _super);
    function ResourceNotFoundError(resource) {
        return _super.call(this, 404, (resource === null || resource === void 0 ? void 0 : resource.length)
            ? "\u30EA\u30BD\u30FC\u30B9 ".concat(resource, " \u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3067\u3057\u305F\u3002")
            : 'リソースが見つかりませんでした。') || this;
    }
    return ResourceNotFoundError;
}(SyntheticError));
exports.ResourceNotFoundError = ResourceNotFoundError;
var ForbiddenError = /** @class */ (function (_super) {
    __extends(ForbiddenError, _super);
    function ForbiddenError(message) {
        return _super.call(this, 403, (0, exports.getMessage)(message, constants_1.CANNOT_ACCESS_ERROR_MESSAGE)) || this;
    }
    return ForbiddenError;
}(SyntheticError));
exports.ForbiddenError = ForbiddenError;
var InternalError = /** @class */ (function (_super) {
    __extends(InternalError, _super);
    function InternalError(message) {
        return _super.call(this, 500, (0, exports.getMessage)(message, constants_1.INTERNAL_SERVER_ERROR_MESSAGE)) || this;
    }
    return InternalError;
}(SyntheticError));
exports.InternalError = InternalError;
var BadRequestError = /** @class */ (function (_super) {
    __extends(BadRequestError, _super);
    function BadRequestError(message) {
        return _super.call(this, 400, (0, exports.getMessage)(message, constants_1.BAD_REQUEST_ERROR_MESSAGE)) || this;
    }
    return BadRequestError;
}(SyntheticError));
exports.BadRequestError = BadRequestError;
var MissingTokenError = /** @class */ (function (_super) {
    __extends(MissingTokenError, _super);
    function MissingTokenError(message) {
        return _super.call(this, 401, (0, exports.getMessage)(message, constants_1.MISSING_TOKEN_ERROR_MESSAGE)) || this;
    }
    return MissingTokenError;
}(SyntheticError));
exports.MissingTokenError = MissingTokenError;
var BadValueError = /** @class */ (function (_super) {
    __extends(BadValueError, _super);
    function BadValueError(message) {
        return _super.call(this, 422, (0, exports.getMessage)(message, constants_1.BAD_VALUE_ERROR_MESSAGE)) || this;
    }
    return BadValueError;
}(SyntheticError));
exports.BadValueError = BadValueError;
var getMessage = function (message, defaultMessage) {
    return message === undefined ? defaultMessage : message;
};
exports.getMessage = getMessage;
