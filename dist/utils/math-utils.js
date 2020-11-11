"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdUtils = void 0;
const uuid_1 = require("uuid");
var IdUtils;
(function (IdUtils) {
    function getRandomUUID() {
        return uuid_1.v4();
    }
    IdUtils.getRandomUUID = getRandomUUID;
})(IdUtils = exports.IdUtils || (exports.IdUtils = {}));
//# sourceMappingURL=math-utils.js.map