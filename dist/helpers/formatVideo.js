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
var getVideoDate_1 = require("../getVideoDate");
var getDateFromText_1 = require("./getDateFromText");
var findVal_1 = require("./findVal");
function formatVideo(video, speedDate) {
    var _a;
    if (speedDate === void 0) { speedDate = false; }
    return __awaiter(this, void 0, void 0, function () {
        var id, durationDatas, splited, hour, minute, second, publishedAt, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 6, , 7]);
                    if (!(video.compactVideoRenderer || video.gridVideoRenderer || video.videoRenderer || video.playlistVideoRenderer)) return [3 /*break*/, 4];
                    if (video.compactVideoRenderer) {
                        video = video.compactVideoRenderer;
                    }
                    else if (video.gridVideoRenderer) {
                        video = video.gridVideoRenderer;
                    }
                    else if (video.playlistVideoRenderer) {
                        video = video.playlistVideoRenderer;
                    }
                    else if (video.videoRenderer) {
                        video = video.videoRenderer;
                    }
                    id = video.videoId;
                    durationDatas = 0;
                    // get title
                    if (video.title.simpleText) {
                        video.title = video.title.simpleText;
                    }
                    else if (video.title.runs[0].text) {
                        video.title = video.title.runs[0].text;
                    }
                    else {
                        video.title = '';
                    }
                    // title formating
                    video.original_title = video.title;
                    if (video.title.split('-').length === 1) {
                        video.artist = '';
                    }
                    else {
                        splited = video.original_title.match(/([^,]*)-(.*)/);
                        video.artist = splited[1];
                        video.title = splited[2];
                    }
                    // duration formating
                    if (video.lengthText) {
                        if (durationDatas === undefined) {
                            findVal_1.default(video.lengthText, 'simpleText');
                        }
                        else {
                            durationDatas = findVal_1.default(video.lengthText, 'text');
                        }
                        if (durationDatas) {
                            durationDatas = durationDatas.split(':');
                        }
                    }
                    else if (video.thumbnailOverlays) {
                        durationDatas = findVal_1.default(video, 'lengthText');
                        if (durationDatas) {
                            durationDatas = durationDatas.split(':');
                        }
                    }
                    hour = 0;
                    minute = 0;
                    second = 0;
                    if (durationDatas) {
                        switch (durationDatas.length) {
                            case 3:
                                hour = parseInt(durationDatas[0]) * 60 * 60;
                                minute = parseInt(durationDatas[1]) * 60;
                                second = parseInt(durationDatas[2]);
                                break;
                            case 2:
                                minute = parseInt(durationDatas[0]) * 60;
                                second = parseInt(durationDatas[1]);
                                break;
                            case 1:
                                second = parseInt(durationDatas[0]);
                                break;
                        }
                    }
                    publishedAt = new Date(Date.now());
                    if (!(speedDate && video.publishedTimeText)) return [3 /*break*/, 1];
                    if (video.publishedTimeText.hasOwnProperty('simpleText')) {
                        publishedAt = getDateFromText_1.default(video.publishedTimeText.simpleText);
                    }
                    else if (video.publishedTimeText.hasOwnProperty('runs')) {
                        publishedAt = getDateFromText_1.default(video.publishedTimeText.runs[0].text);
                    }
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, getVideoDate_1.default(id)];
                case 2:
                    publishedAt = _b.sent();
                    _b.label = 3;
                case 3: return [2 /*return*/, {
                        id: id,
                        original_title: video.original_title.trim(),
                        title: video.title.trim(),
                        artist: video.artist.trim(),
                        duration: hour + minute + second,
                        publishedAt: publishedAt,
                    }];
                case 4:
                    if (video.didYouMeanRenderer || video.showingResultsForRenderer) {
                        video = video.didYouMeanRenderer ? video.didYouMeanRenderer : video.showingResultsForRenderer;
                        return [2 /*return*/, {
                                id: 'didyoumean',
                                original_title: '',
                                title: ((_a = video.correctedQuery) === null || _a === void 0 ? void 0 : _a.runs[0].text) || '',
                                artist: '',
                                duration: 0,
                                publishedAt: new Date(Date.now()),
                                views: 0,
                            }];
                    }
                    _b.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    e_1 = _b.sent();
                    console.log('format video failed');
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.default = formatVideo;
//# sourceMappingURL=formatVideo.js.map