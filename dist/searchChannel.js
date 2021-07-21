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
var findVal_1 = require("./helpers/findVal");
function searchChannel(terms, token, apikey) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function () {
        var items, channels, didyoumean, data, data, i, item, avatar, avatarId, nbSubscriber, nbVideo, item, e_1;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 5, , 6]);
                    items = [];
                    channels = [];
                    didyoumean = '';
                    if (!!token) return [3 /*break*/, 2];
                    return [4 /*yield*/, getData_1.default('https://m.youtube.com/results?sp=EgIQAg%253D%253D&search_query=' + encodeURI(terms))];
                case 1:
                    data = _e.sent();
                    apikey = data.apikey;
                    token = findVal_1.default(data, 'token');
                    items = findVal_1.default(data, 'itemSectionRenderer').contents;
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, getData_1.default('https://www.youtube.com/youtubei/v1/search?key=' + apikey + '&token=' + token)];
                case 3:
                    data = _e.sent();
                    items = findVal_1.default(data.items, 'contents');
                    token = data.token;
                    _e.label = 4;
                case 4:
                    for (i = 0; i < items.length; i++) {
                        if (items[i].compactChannelRenderer || items[i].channelRenderer) {
                            item = (items[i].compactChannelRenderer) ? items[i].compactChannelRenderer : items[i].channelRenderer;
                            item.name = (items[i].compactChannelRenderer) ? item.title.runs[0].text : item.title.simpleText;
                            avatar = ((_a = item.thumbnail) === null || _a === void 0 ? void 0 : _a.thumbnails[0].url) || '';
                            avatarId = avatar.substring(avatar.lastIndexOf('ytc/') + 4, avatar.lastIndexOf('=s'));
                            nbSubscriber = formatYoutubeCount_1.default(((_b = item.subscriberCountText) === null || _b === void 0 ? void 0 : _b.accessibility.accessibilityData.label) || '0');
                            nbVideo = formatYoutubeCount_1.default(((_d = (_c = item.videoCountText) === null || _c === void 0 ? void 0 : _c.runs[0]) === null || _d === void 0 ? void 0 : _d.text) || '0');
                            channels.push({
                                name: item.name,
                                channel_id: item.channelId,
                                nb_videos: nbVideo,
                                nb_subscriber: nbSubscriber,
                                official: (item.ownerBadges ? true : false),
                                channel_avatar_small: 'https://yt3.ggpht.com/ytc/' + avatarId + '=s80',
                                channel_avatar_medium: 'https://yt3.ggpht.com/ytc/' + avatarId + '=s200',
                                channel_avatar_large: 'https://yt3.ggpht.com/ytc/' + avatarId + '=s800',
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
                            apikey: apikey,
                        }];
                case 5:
                    e_1 = _e.sent();
                    console.log('search channel error, terms: ' + terms);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.default = searchChannel;
//# sourceMappingURL=searchChannel.js.map