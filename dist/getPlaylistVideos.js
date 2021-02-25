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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var getData_1 = require("./helpers/getData");
var formatVideo_1 = require("./helpers/formatVideo");
function getPlaylistVideos(id, speedDate) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    return __awaiter(this, void 0, void 0, function () {
        var data, items, token, videos, i, _l, _m, e_1;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    _o.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, getData_1.default('https://m.youtube.com/playlist?list=' + id)];
                case 1:
                    data = _o.sent();
                    items = ((_j = (_h = (_g = (_f = (_e = (_d = (_c = (_b = (_a = data.contents) === null || _a === void 0 ? void 0 : _a.singleColumnBrowseResultsRenderer) === null || _b === void 0 ? void 0 : _b.tabs[0]) === null || _c === void 0 ? void 0 : _c.tabRenderer) === null || _d === void 0 ? void 0 : _d.content) === null || _e === void 0 ? void 0 : _e.sectionListRenderer) === null || _f === void 0 ? void 0 : _f.contents[0]) === null || _g === void 0 ? void 0 : _g.itemSectionRenderer) === null || _h === void 0 ? void 0 : _h.contents[0]) === null || _j === void 0 ? void 0 : _j.playlistVideoListRenderer) || '';
                    token = ((_k = items.continuations[0]) === null || _k === void 0 ? void 0 : _k.nextContinuationData.continuation) || '';
                    videos = [];
                    i = 0;
                    _o.label = 2;
                case 2:
                    if (!(i < items.contents.length)) return [3 /*break*/, 5];
                    _m = (_l = videos).push;
                    return [4 /*yield*/, formatVideo_1.default(items.contents[i], speedDate)];
                case 3:
                    _m.apply(_l, [_o.sent()]);
                    _o.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5: 
                // while(token !== '') {
                //   try {
                //     wait()
                //     let nextData: any = await getData('https://m.youtube.com/playlist?ctoken='+token)
                //     let nextVideos: any = nextData.continuationContents.playlistVideoListContinuation.contents
                //     if(nextData.continuations) {
                //       token = nextData.continuations[0]?.nextContinuationData.continuation
                //     }
                //     else {
                //       token = ''
                //     }
                //     for(let i = 0; i < nextVideos.length; i++) {
                //       videos.push(await formatVideo(nextVideos[i], speedDate))
                //     }
                //   } catch(e) {
                //     console.log('getPlaylistVideos failed')
                //     // console.log(e)
                //     token = ''
                //   }
                // }
                return [2 /*return*/, videos];
                case 6:
                    e_1 = _o.sent();
                    console.log('cannot get playlist ' + id + ', try again');
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.default = getPlaylistVideos;
//# sourceMappingURL=getPlaylistVideos.js.map