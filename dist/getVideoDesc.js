"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const getData_1 = require("./helpers/getData");
function getVideoDesc(id) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield getData_1.default('https://m.youtube.com/watch?v=' + id);
            let description = ((_j = (_h = (_g = (_f = (_e = (_d = (_c = (_b = (_a = data.contents) === null || _a === void 0 ? void 0 : _a.singleColumnWatchNextResults) === null || _b === void 0 ? void 0 : _b.results) === null || _c === void 0 ? void 0 : _c.results) === null || _d === void 0 ? void 0 : _d.contents[1]) === null || _e === void 0 ? void 0 : _e.itemSectionRenderer) === null || _f === void 0 ? void 0 : _f.contents[0]) === null || _g === void 0 ? void 0 : _g.slimVideoMetadataRenderer) === null || _h === void 0 ? void 0 : _h.description) === null || _j === void 0 ? void 0 : _j.runs) || '';
            return description;
        }
        catch (e) {
            console.log('video desc error for ' + id);
            // console.log(e)
        }
    });
}
exports.default = getVideoDesc;
//# sourceMappingURL=getVideoDesc.js.map