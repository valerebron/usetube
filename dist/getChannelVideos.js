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
var wait_1 = require("./helpers/wait");
function getChannelVideos(id, published_after) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    return __awaiter(this, void 0, void 0, function () {
        var data, channel, token, videos, i, video, data_1, newVideos, i, video, e_1, e_2;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    _l.trys.push([0, 15, , 16]);
                    return [4 /*yield*/, getData_1.default('https://m.youtube.com/channel/' + id + '/videos')];
                case 1:
                    data = _l.sent();
                    channel = (_g = (_f = (_e = (_d = (_c = (_b = (_a = data.contents) === null || _a === void 0 ? void 0 : _a.singleColumnBrowseResultsRenderer) === null || _b === void 0 ? void 0 : _b.tabs[1]) === null || _c === void 0 ? void 0 : _c.tabRenderer) === null || _d === void 0 ? void 0 : _d.content) === null || _e === void 0 ? void 0 : _e.sectionListRenderer) === null || _f === void 0 ? void 0 : _f.contents[0]) === null || _g === void 0 ? void 0 : _g.itemSectionRenderer;
                    token = ((_k = (_j = (_h = channel.continuations) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.nextContinuationData) === null || _k === void 0 ? void 0 : _k.continuation) || '';
                    videos = [];
                    i = 0;
                    _l.label = 2;
                case 2:
                    if (!(i < channel.contents.length)) return [3 /*break*/, 5];
                    return [4 /*yield*/, formatVideo_1.default(channel.contents[i], false)];
                case 3:
                    video = _l.sent();
                    if ((published_after && video.publishedAt.getTime() > published_after.getTime()) || !published_after) {
                        videos.push(video);
                    }
                    else {
                        return [2 /*return*/, videos];
                    }
                    _l.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5:
                    if (!(token !== '')) return [3 /*break*/, 14];
                    _l.label = 6;
                case 6:
                    _l.trys.push([6, 12, , 13]);
                    wait_1.default();
                    return [4 /*yield*/, getData_1.default('https://youtube.com/browse_ajax?ctoken=' + token)];
                case 7:
                    data_1 = _l.sent();
                    newVideos = data_1.items;
                    token = data_1.token;
                    i = 0;
                    _l.label = 8;
                case 8:
                    if (!(i < newVideos.length)) return [3 /*break*/, 11];
                    return [4 /*yield*/, formatVideo_1.default(newVideos[i], false)];
                case 9:
                    video = _l.sent();
                    if (published_after) {
                        if (video.publishedAt.getTime() > published_after.getTime()) {
                            videos.push(video);
                        }
                    }
                    else {
                        return [2 /*return*/, videos];
                    }
                    _l.label = 10;
                case 10:
                    i++;
                    return [3 /*break*/, 8];
                case 11: return [3 /*break*/, 13];
                case 12:
                    e_1 = _l.sent();
                    console.log('getChannelVideos failed');
                    // console.log(e)
                    token = '';
                    return [3 /*break*/, 13];
                case 13: return [3 /*break*/, 5];
                case 14: return [2 /*return*/, videos];
                case 15:
                    e_2 = _l.sent();
                    console.log('cannot get channel videos for id: ' + id + ', try again');
                    return [3 /*break*/, 16];
                case 16: return [2 /*return*/];
            }
        });
    });
}
exports.default = getChannelVideos;
//# sourceMappingURL=getChannelVideos.js.map