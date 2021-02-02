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
function getVideoDate(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let publishText = yield getData_1.default('https://m.youtube.com/watch?v=' + id + '&type=date');
            publishText.replace('-', '/');
            publishText += ' ' + Math.floor(Math.random() * 24) + ':' + Math.floor(Math.random() * 60) + ':' + Math.floor(Math.random() * 60);
            return new Date(Date.parse(publishText));
        }
        catch (e) {
            console.log('cannot get date for ' + id + ', try again');
            // console.log(e)
        }
    });
}
exports.default = getVideoDate;
//# sourceMappingURL=getVideoDate.js.map