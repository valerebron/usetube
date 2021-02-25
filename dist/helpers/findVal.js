"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function findVal(object, key) {
    var value;
    Object.keys(object).some(function (k) {
        if (k === key) {
            value = object[k];
            return true;
        }
        if (object[k] && typeof object[k] === 'object') {
            value = findVal(object[k], key);
            return value !== undefined;
        }
    });
    return value;
}
exports.default = findVal;
//# sourceMappingURL=findVal.js.map