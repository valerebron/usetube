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
const formatYoutubeCount_1 = require("./helpers/formatYoutubeCount");
function searchChannel(terms, token) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let items = [];
            let channels = [];
            let didyoumean = '';
            if (!token) {
                const data = yield getData_1.default('https://m.youtube.com/results?sp=CAASAhAC&search_query=' + encodeURI(terms));
                items = (_c = (_b = (_a = data.contents.sectionListRenderer) === null || _a === void 0 ? void 0 : _a.contents[0]) === null || _b === void 0 ? void 0 : _b.itemSectionRenderer) === null || _c === void 0 ? void 0 : _c.contents;
                token = ((_f = (_e = (_d = data.continuations) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.reloadContinuationData) === null || _f === void 0 ? void 0 : _f.continuation) || '';
            }
            else {
                let data = yield getData_1.default('https://youtube.com/browse_ajax?ctoken=' + token);
                items = data.items || '';
                token = ((_j = (_h = (_g = data.continuations) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.nextContinuationData) === null || _j === void 0 ? void 0 : _j.continuation) || '';
            }
            for (let i = 0; i < items.length; i++) {
                if (items[i].compactChannelRenderer) {
                    const item = items[i].compactChannelRenderer;
                    let avatarSmall = ((_k = item.thumbnail) === null || _k === void 0 ? void 0 : _k.thumbnails[0].url) || '';
                    let avatarBig = ((_l = item.thumbnail) === null || _l === void 0 ? void 0 : _l.thumbnails[1].url) || '';
                    avatarSmall = (avatarSmall.startsWith('//') ? 'https:' + avatarSmall : avatarSmall);
                    avatarBig = (avatarBig.startsWith('//') ? 'https:' + avatarBig : avatarBig);
                    const nbSubscriber = formatYoutubeCount_1.default((_m = item.subscriberCountText) === null || _m === void 0 ? void 0 : _m.runs[0].text);
                    const nbVideo = formatYoutubeCount_1.default((_o = item.videoCountText) === null || _o === void 0 ? void 0 : _o.runs[0].text);
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
                    let item;
                    if (items[i].didYouMeanRenderer) {
                        item = items[i].didYouMeanRenderer;
                    }
                    else {
                        item = items[i].showingResultsForRenderer;
                    }
                    didyoumean = item.correctedQuery.runs[0].text;
                }
            }
            return {
                channels: channels,
                didyoumean: didyoumean,
                token: token,
            };
        }
        catch (e) {
            console.log('search channel error, terms: ' + terms);
            console.log(e);
        }
    });
}
exports.default = searchChannel;
//# sourceMappingURL=searchChannel.js.map