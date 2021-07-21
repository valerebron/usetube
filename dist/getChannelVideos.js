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
var findVal_1 = require("./helpers/findVal");
function getChannelVideos(id, published_after) {
    return __awaiter(this, void 0, void 0, function () {
        var data, apikey, channel, token, videos, i, video, data_1, newVideos, i, video, e_1, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 15, , 16]);
                    return [4 /*yield*/, getData_1.default('https://m.youtube.com/channel/' + id + '/videos')];
                case 1:
                    data = _a.sent();
                    apikey = data.apikey;
                    channel = findVal_1.default(data, 'itemSectionRenderer').contents;
                    token = findVal_1.default(data, 'token');
                    videos = [];
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < channel.length)) return [3 /*break*/, 5];
                    return [4 /*yield*/, formatVideo_1.default(channel[i], false)];
                case 3:
                    video = _a.sent();
                    if (video && video.publishedAt) {
                        if ((published_after && video.publishedAt.getTime() > published_after.getTime()) || !published_after) {
                            videos.push(video);
                        }
                    }
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5:
                    if (!token) return [3 /*break*/, 14];
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, 12, , 13]);
                    return [4 /*yield*/, getData_1.default('https://www.youtube.com/youtubei/v1/browse?key=' + apikey + '&token=' + token)];
                case 7:
                    data_1 = _a.sent();
                    newVideos = data_1.items;
                    token = data_1.token;
                    i = 0;
                    _a.label = 8;
                case 8:
                    if (!(i < newVideos.length)) return [3 /*break*/, 11];
                    return [4 /*yield*/, formatVideo_1.default(newVideos[i], false)];
                case 9:
                    video = _a.sent();
                    if (video) {
                        if (published_after) {
                            if (video.publishedAt.getTime() > published_after.getTime()) {
                                videos.push(video);
                            }
                            else {
                                token = '';
                            }
                        }
                        else {
                            videos.push(video);
                        }
                    }
                    _a.label = 10;
                case 10:
                    i++;
                    return [3 /*break*/, 8];
                case 11: return [3 /*break*/, 13];
                case 12:
                    e_1 = _a.sent();
                    console.log('getChannelVideos failed');
                    token = '';
                    return [3 /*break*/, 13];
                case 13: return [3 /*break*/, 5];
                case 14: return [2 /*return*/, videos];
                case 15:
                    e_2 = _a.sent();
                    console.log('cannot get channel videos for id: ' + id + ', try again');
                    return [3 /*break*/, 16];
                case 16: return [2 /*return*/];
            }
        });
    });
}
exports.default = getChannelVideos;
//# sourceMappingURL=getChannelVideos.js.map