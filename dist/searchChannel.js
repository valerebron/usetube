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
var formatYoutubeCount_1 = require("./helpers/formatYoutubeCount");
function searchChannel(terms, token) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    return __awaiter(this, void 0, void 0, function () {
        var items, channels, didyoumean, data, data, i, item, avatarSmall, avatarBig, nbSubscriber, nbVideo, item, e_1;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    _p.trys.push([0, 5, , 6]);
                    items = [];
                    channels = [];
                    didyoumean = '';
                    if (!!token) return [3 /*break*/, 2];
                    return [4 /*yield*/, getData_1.default('https://m.youtube.com/results?sp=CAASAhAC&search_query=' + encodeURI(terms))];
                case 1:
                    data = _p.sent();
                    items = (_c = (_b = (_a = data.contents.sectionListRenderer) === null || _a === void 0 ? void 0 : _a.contents[0]) === null || _b === void 0 ? void 0 : _b.itemSectionRenderer) === null || _c === void 0 ? void 0 : _c.contents;
                    token = ((_f = (_e = (_d = data.continuations) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.reloadContinuationData) === null || _f === void 0 ? void 0 : _f.continuation) || '';
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, getData_1.default('https://youtube.com/browse_ajax?ctoken=' + token)];
                case 3:
                    data = _p.sent();
                    items = data.items || '';
                    token = ((_j = (_h = (_g = data.continuations) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.nextContinuationData) === null || _j === void 0 ? void 0 : _j.continuation) || '';
                    _p.label = 4;
                case 4:
                    for (i = 0; i < items.length; i++) {
                        if (items[i].compactChannelRenderer) {
                            item = items[i].compactChannelRenderer;
                            avatarSmall = ((_k = item.thumbnail) === null || _k === void 0 ? void 0 : _k.thumbnails[0].url) || '';
                            avatarBig = ((_l = item.thumbnail) === null || _l === void 0 ? void 0 : _l.thumbnails[1].url) || '';
                            avatarSmall = (avatarSmall.startsWith('//') ? 'https:' + avatarSmall : avatarSmall);
                            avatarBig = (avatarBig.startsWith('//') ? 'https:' + avatarBig : avatarBig);
                            nbSubscriber = formatYoutubeCount_1.default((_m = item.subscriberCountText) === null || _m === void 0 ? void 0 : _m.runs[0].text);
                            nbVideo = formatYoutubeCount_1.default((_o = item.videoCountText) === null || _o === void 0 ? void 0 : _o.runs[0].text);
                            channels.push({
                                name: item.title.runs[0].text,
                                channel_id: item.channelId,
                                nb_videos: nbVideo,
                                nb_subscriber: nbSubscriber,
                                official: (item.ownerBadges ? true : false),
                                channel_avatar_small: avatarSmall,
                                channel_avatar_medium: avatarBig,
                            });
                        }
                        else if (items[i].didYouMeanRenderer || items[i].showingResultsForRenderer) {
                            item = void 0;
                            if (items[i].didYouMeanRenderer) {
                                item = items[i].didYouMeanRenderer;
                            }
                            else {
                                item = items[i].showingResultsForRenderer;
                            }
                            didyoumean = item.correctedQuery.runs[0].text;
                        }
                    }
                    return [2 /*return*/, {
                            channels: channels,
                            didyoumean: didyoumean,
                            token: token,
                        }];
                case 5:
                    e_1 = _p.sent();
                    console.log('search channel error, terms: ' + terms);
                    console.log(e_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.default = searchChannel;
//# sourceMappingURL=searchChannel.js.map