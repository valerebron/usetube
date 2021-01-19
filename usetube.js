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
var axios_1 = require("axios");
var moment = require("moment");
var headers = { headers: {
        'Access-Control-Allow-Origin': '*',
        'x-youtube-client-name': 1,
        'x-youtube-client-version': '2.20200911.04.00',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Mobile Safari/537.36'
    } };
var headersAJAX = { headers: {
        'Access-Control-Allow-Origin': '*',
        'User-Agent': 'hellobiczes',
        'x-youtube-client-name': 1,
        'x-youtube-client-version': '2.20200731.02.01'
    } };
var mobileRegex = /var\ ytInitialData\ \=\ \'(.*)\'\;<\/script>/;
var dateRegex = /publishDate":"(.*)","ownerChannelName/;
function decodeHex(hex) {
    return hex.replace(/\\x22/g, '"').replace(/\\x7b/g, '{').replace(/\\x7d/g, '}').replace(/\\x5b/g, '[').replace(/\\x5d/g, ']').replace(/\\x3b/g, ';').replace(/\\x3d/g, '=').replace(/\\x27/g, '\'').replace(/\\\\/g, 'doubleAntiSlash').replace(/\\/g, '').replace(/doubleAntiSlash/g, '\\');
}
function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}
function formatYoutubeCount(raw) {
    var isMill = raw === null || raw === void 0 ? void 0 : raw.includes('M');
    var isKilo = raw === null || raw === void 0 ? void 0 : raw.includes('k');
    var nbSubscriber = raw === null || raw === void 0 ? void 0 : raw.replace(/[^0-9,.]/g, '').replace(',', '.');
    if (isMill) {
        nbSubscriber *= 1000000;
    }
    else if (isKilo) {
        nbSubscriber *= 1000;
    }
    return parseInt(nbSubscriber) || 0;
}
function getVideoDate(id) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var body, publishText, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1["default"].get('https://m.youtube.com/watch?v=' + id, headers)];
                case 1:
                    body = (_b.sent()).data;
                    publishText = ((_a = dateRegex.exec(body)) === null || _a === void 0 ? void 0 : _a[1]) || '{}';
                    publishText += ' ' + Math.floor(Math.random() * 24) + '-' + Math.floor(Math.random() * 60) + '-' + Math.floor(Math.random() * 60);
                    return [2 /*return*/, moment(publishText, 'YYYY-MM-DD H-m-s').toDate()];
                case 2:
                    e_1 = _b.sent();
                    // console.log('cannot get date for '+id+', try again')
                    getVideoDate(id);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getChannelDesc(id) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var body, raw, data, description, e_2;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1["default"].get('https://m.youtube.com/channel/' + encodeURI(id) + '/videos', headers)];
                case 1:
                    body = (_d.sent()).data;
                    raw = ((_a = mobileRegex.exec(body)) === null || _a === void 0 ? void 0 : _a[1]) || '{}';
                    data = JSON.parse(decodeHex(raw));
                    description = ((_c = (_b = data.metadata) === null || _b === void 0 ? void 0 : _b.channelMetadataRenderer) === null || _c === void 0 ? void 0 : _c.description) || '';
                    return [2 /*return*/, description];
                case 2:
                    e_2 = _d.sent();
                    console.log('channel desc error for ' + id, e_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function searchVideo(terms, token) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    return __awaiter(this, void 0, void 0, function () {
        var items, videos, didyoumean, body, raw, datas, data, i, formated, e_3;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    _m.trys.push([0, 9, , 10]);
                    items = [];
                    videos = [];
                    didyoumean = '';
                    if (!!token) return [3 /*break*/, 2];
                    return [4 /*yield*/, axios_1["default"].get('https://m.youtube.com/results?sp=EgIQAQ%253D%253D&videoEmbeddable=true&search_query=' + terms, headers)];
                case 1:
                    body = (_m.sent()).data;
                    raw = ((_a = mobileRegex.exec(body)) === null || _a === void 0 ? void 0 : _a[1]) || '{}';
                    datas = JSON.parse(decodeHex(raw)).contents.sectionListRenderer;
                    items = datas.contents[0].itemSectionRenderer.contents;
                    token = ((_d = (_c = (_b = datas.continuations) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.reloadContinuationData) === null || _d === void 0 ? void 0 : _d.continuation) || '';
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, axios_1["default"].get('https://youtube.com/browse_ajax?ctoken=' + token, headersAJAX)];
                case 3:
                    data = (_m.sent()).data;
                    items = ((_f = (_e = data[1].response.continuationContents) === null || _e === void 0 ? void 0 : _e.gridContinuation) === null || _f === void 0 ? void 0 : _f.items) || '';
                    token = ((_l = (_k = (_j = (_h = (_g = data[1].response.continuationContents) === null || _g === void 0 ? void 0 : _g.gridContinuation) === null || _h === void 0 ? void 0 : _h.continuations) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.nextContinuationData) === null || _l === void 0 ? void 0 : _l.continuation) || '';
                    _m.label = 4;
                case 4:
                    i = 0;
                    _m.label = 5;
                case 5:
                    if (!(i < items.length)) return [3 /*break*/, 8];
                    return [4 /*yield*/, formatVideo(items[i], true)];
                case 6:
                    formated = _m.sent();
                    if (formated.id === 'didyoumean') {
                        didyoumean = formated.title;
                    }
                    else {
                        videos.push(formated);
                    }
                    _m.label = 7;
                case 7:
                    i++;
                    return [3 /*break*/, 5];
                case 8: return [2 /*return*/, {
                        tracks: videos,
                        didyoumean: didyoumean,
                        token: token
                    }];
                case 9:
                    e_3 = _m.sent();
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
function searchChannel(terms, token) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    return __awaiter(this, void 0, void 0, function () {
        var items, channels, didyoumean, body, raw, data, data, i, item, avatarSmall, avatarBig, nbSubscriber, nbVideo, item, e_4;
        return __generator(this, function (_u) {
            switch (_u.label) {
                case 0:
                    _u.trys.push([0, 5, , 6]);
                    items = [];
                    channels = [];
                    didyoumean = '';
                    if (!!token) return [3 /*break*/, 2];
                    return [4 /*yield*/, axios_1["default"].get('https://m.youtube.com/results?sp=CAASAhAC&search_query=' + encodeURI(terms), headers)];
                case 1:
                    body = (_u.sent()).data;
                    raw = ((_a = mobileRegex.exec(body)) === null || _a === void 0 ? void 0 : _a[1]) || '{}';
                    data = JSON.parse(decodeHex(raw));
                    items = (_d = (_c = (_b = data.contents.sectionListRenderer) === null || _b === void 0 ? void 0 : _b.contents[0]) === null || _c === void 0 ? void 0 : _c.itemSectionRenderer) === null || _d === void 0 ? void 0 : _d.contents;
                    token = ((_g = (_f = (_e = data.continuations) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.reloadContinuationData) === null || _g === void 0 ? void 0 : _g.continuation) || '';
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, axios_1["default"].get('https://youtube.com/browse_ajax?ctoken=' + token, headersAJAX)];
                case 3:
                    data = (_u.sent()).data;
                    items = ((_j = (_h = data[1].response.continuationContents) === null || _h === void 0 ? void 0 : _h.gridContinuation) === null || _j === void 0 ? void 0 : _j.items) || '';
                    token = ((_p = (_o = (_m = (_l = (_k = data[1].response.continuationContents) === null || _k === void 0 ? void 0 : _k.gridContinuation) === null || _l === void 0 ? void 0 : _l.continuations) === null || _m === void 0 ? void 0 : _m[0]) === null || _o === void 0 ? void 0 : _o.nextContinuationData) === null || _p === void 0 ? void 0 : _p.continuation) || '';
                    _u.label = 4;
                case 4:
                    for (i = 0; i < items.length; i++) {
                        if (items[i].compactChannelRenderer) {
                            item = items[i].compactChannelRenderer;
                            avatarSmall = ((_q = item.thumbnail) === null || _q === void 0 ? void 0 : _q.thumbnails[0].url) || '';
                            avatarBig = ((_r = item.thumbnail) === null || _r === void 0 ? void 0 : _r.thumbnails[1].url) || '';
                            avatarSmall = (avatarSmall.startsWith('//') ? 'https:' + avatarSmall : avatarSmall);
                            avatarBig = (avatarBig.startsWith('//') ? 'https:' + avatarBig : avatarBig);
                            nbSubscriber = formatYoutubeCount((_s = item.subscriberCountText) === null || _s === void 0 ? void 0 : _s.runs[0].text);
                            nbVideo = formatYoutubeCount((_t = item.videoCountText) === null || _t === void 0 ? void 0 : _t.runs[0].text);
                            channels.push({
                                name: item.title.runs[0].text,
                                channel_id: item.channelId,
                                nb_videos: nbVideo,
                                nb_subscriber: nbSubscriber,
                                official: (item.ownerBadges ? true : false),
                                channel_avatar_small: avatarSmall,
                                channel_avatar_medium: avatarBig
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
                            token: token
                        }];
                case 5:
                    e_4 = _u.sent();
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function getChannelVideos(id, published_after) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
    return __awaiter(this, void 0, void 0, function () {
        var body, raw, data, items, token, videos, i, video, data_1, newVideos, i, video, e_5, e_6;
        return __generator(this, function (_w) {
            switch (_w.label) {
                case 0:
                    _w.trys.push([0, 15, , 16]);
                    return [4 /*yield*/, axios_1["default"].get('https://m.youtube.com/channel/' + id + '/videos', headers)];
                case 1:
                    body = (_w.sent()).data;
                    raw = ((_a = mobileRegex.exec(body)) === null || _a === void 0 ? void 0 : _a[1]) || '{}';
                    data = JSON.parse(decodeHex(raw));
                    items = (_h = (_g = (_f = (_e = (_d = (_c = (_b = data.contents) === null || _b === void 0 ? void 0 : _b.singleColumnBrowseResultsRenderer) === null || _c === void 0 ? void 0 : _c.tabs[1]) === null || _d === void 0 ? void 0 : _d.tabRenderer) === null || _e === void 0 ? void 0 : _e.content) === null || _f === void 0 ? void 0 : _f.sectionListRenderer) === null || _g === void 0 ? void 0 : _g.contents[0]) === null || _h === void 0 ? void 0 : _h.itemSectionRenderer;
                    token = ((_l = (_k = (_j = items.continuations) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.nextContinuationData) === null || _l === void 0 ? void 0 : _l.continuation) || '';
                    videos = [];
                    i = 0;
                    _w.label = 2;
                case 2:
                    if (!(i < items.contents.length)) return [3 /*break*/, 5];
                    return [4 /*yield*/, formatVideo(items.contents[i])];
                case 3:
                    video = _w.sent();
                    if (moment(video.publishedAt).isBefore(published_after) && published_after) {
                        return [2 /*return*/, videos];
                    }
                    else {
                        videos.push(video);
                    }
                    _w.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5:
                    if (!(token !== '')) return [3 /*break*/, 14];
                    _w.label = 6;
                case 6:
                    _w.trys.push([6, 12, , 13]);
                    wait(Math.floor(Math.random() * 300));
                    return [4 /*yield*/, axios_1["default"].get('https://youtube.com/browse_ajax?ctoken=' + token, headersAJAX)];
                case 7:
                    data_1 = (_w.sent()).data;
                    newVideos = ((_q = (_p = (_o = (_m = data_1[1]) === null || _m === void 0 ? void 0 : _m.response) === null || _o === void 0 ? void 0 : _o.continuationContents) === null || _p === void 0 ? void 0 : _p.gridContinuation) === null || _q === void 0 ? void 0 : _q.items) || '';
                    token = ((_v = (_u = (_t = (_s = (_r = data_1[1].response.continuationContents) === null || _r === void 0 ? void 0 : _r.gridContinuation) === null || _s === void 0 ? void 0 : _s.continuations) === null || _t === void 0 ? void 0 : _t[0]) === null || _u === void 0 ? void 0 : _u.nextContinuationData) === null || _v === void 0 ? void 0 : _v.continuation) || '';
                    i = 0;
                    _w.label = 8;
                case 8:
                    if (!(i < newVideos.length)) return [3 /*break*/, 11];
                    return [4 /*yield*/, formatVideo(newVideos[i])];
                case 9:
                    video = _w.sent();
                    if (moment(video.publishedAt).isBefore(published_after) && published_after) {
                        return [2 /*return*/, videos];
                    }
                    else {
                        videos.push(video);
                    }
                    _w.label = 10;
                case 10:
                    i++;
                    return [3 /*break*/, 8];
                case 11: return [3 /*break*/, 13];
                case 12:
                    e_5 = _w.sent();
                    // console.log('getChannelVideos failed')
                    // console.log(e)
                    token = '';
                    return [3 /*break*/, 13];
                case 13: return [3 /*break*/, 5];
                case 14: return [2 /*return*/, videos];
                case 15:
                    e_6 = _w.sent();
                    // console.log('cannot get channel videos for id: '+id+', try again')
                    getChannelVideos(id, published_after);
                    return [3 /*break*/, 16];
                case 16: return [2 /*return*/];
            }
        });
    });
}
function getPlaylistVideos(id) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var body, raw, e_7;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1["default"].get('https://m.youtube.com/playlist?list=' + id, headers)];
                case 1:
                    body = (_b.sent()).data;
                    raw = ((_a = mobileRegex.exec(body)) === null || _a === void 0 ? void 0 : _a[1]) || '{}';
                    return [2 /*return*/, raw];
                case 2:
                    e_7 = _b.sent();
                    console.log('cannot get playlist ' + id + ', try again');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function formatVideo(video, speedDate) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function () {
        var id, durationDatas, splited, minutes, seconds, publishedAt, _f, e_8;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _g.trys.push([0, 6, , 7]);
                    if (!(video.compactVideoRenderer || video.gridVideoRenderer)) return [3 /*break*/, 4];
                    video = video.compactVideoRenderer ? video.compactVideoRenderer : video.gridVideoRenderer;
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
                        durationDatas = video.lengthText.runs[0].text.split(':');
                    }
                    else if ((_b = (_a = video.thumbnailOverlays[0]) === null || _a === void 0 ? void 0 : _a.thumbnailOverlayTimeStatusRenderer) === null || _b === void 0 ? void 0 : _b.text.simpleText) {
                        durationDatas = ((_d = (_c = video.thumbnailOverlays[0]) === null || _c === void 0 ? void 0 : _c.thumbnailOverlayTimeStatusRenderer) === null || _d === void 0 ? void 0 : _d.text.simpleText.split(':')) || '';
                    }
                    else {
                        durationDatas = [0, 0];
                    }
                    minutes = parseInt(durationDatas[0]) * 60;
                    seconds = parseInt(durationDatas[1]);
                    if (!!speedDate) return [3 /*break*/, 2];
                    return [4 /*yield*/, getVideoDate(id)];
                case 1:
                    _f = _g.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _f = ((_e = video.publishedTimeText) === null || _e === void 0 ? void 0 : _e.runs[0].text) || '';
                    _g.label = 3;
                case 3:
                    publishedAt = _f;
                    return [2 /*return*/, {
                            id: id,
                            original_title: video.original_title.trim(),
                            title: video.title.trim(),
                            artist: video.artist.trim(),
                            duration: minutes + seconds,
                            publishedAt: publishedAt
                        }];
                case 4:
                    if (video.didYouMeanRenderer || video.showingResultsForRenderer) {
                        video = video.didYouMeanRenderer ? video.didYouMeanRenderer : video.showingResultsForRenderer;
                        return [2 /*return*/, {
                                id: 'didyoumean',
                                title: video.correctedQuery.runs[0].text,
                                artist: '',
                                duration: 0,
                                publishedAt: ''
                            }];
                    }
                    _g.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    e_8 = _g.sent();
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
module.exports = {
    getVideoDate: getVideoDate,
    getChannelDesc: getChannelDesc,
    searchVideo: searchVideo,
    searchChannel: searchChannel,
    getChannelVideos: getChannelVideos
};
