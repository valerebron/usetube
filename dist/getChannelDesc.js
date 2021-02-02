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
function getChannelDesc(id) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield getData_1.default('https://m.youtube.com/channel/' + id + '/videos');
            let description = ((_b = (_a = data.metadata) === null || _a === void 0 ? void 0 : _a.channelMetadataRenderer) === null || _b === void 0 ? void 0 : _b.description) || '';
            return description;
        }
        catch (e) {
            console.log('channel desc error for ' + id);
            // console.log(e)
        }
    });
}
exports.default = getChannelDesc;
//# sourceMappingURL=getChannelDesc.js.map