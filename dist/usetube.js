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
const axios_1 = require("axios");
const moment = require("moment");
const headers = { headers: {
        'Access-Control-Allow-Origin': '*',
        'x-youtube-client-name': 1,
        'x-youtube-client-version': '2.20200911.04.00',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Mobile Safari/537.36',
    } };
const headersAJAX = { headers: {
        'Access-Control-Allow-Origin': '*',
        'User-Agent': 'hellobiczes',
        'x-youtube-client-name': 1,
        'x-youtube-client-version': '2.20200731.02.01'
    } };
const videoRegex = /ytInitialPlayerConfig\ \=\ (.*)\;\n\ \ \ \ \ \ setTimeout/;
const mobileRegex = /id\=\"initial\-data\"\>\<\!\-\-\ (.*)\ \-\-\>\<\/div\>\<script\ \>if/;
function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}
function formatYoutubeCount(raw) {
    const isMill = raw === null || raw === void 0 ? void 0 : raw.includes('M');
    const isKilo = raw === null || raw === void 0 ? void 0 : raw.includes('k');
    let nbSubscriber = raw === null || raw === void 0 ? void 0 : raw.replace(/[^0-9,.]/g, '').replace(',', '.');
    if (isMill) {
        nbSubscriber *= 1000000;
    }
    else if (isKilo) {
        nbSubscriber *= 1000;
    }
    return parseInt(nbSubscriber) || 0;
}
function getVideoDate(id) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = (yield axios_1.default.get('https://m.youtube.com/watch?v=' + id, headers)).data;
            const raw = ((_a = videoRegex.exec(body)) === null || _a === void 0 ? void 0 : _a[1]) || '{}';
            const datas = JSON.parse(raw);
            let publishText = (_c = (_b = JSON.parse(datas.args.player_response).microformat) === null || _b === void 0 ? void 0 : _b.playerMicroformatRenderer) === null || _c === void 0 ? void 0 : _c.publishDate;
            publishText += ' ' + Math.floor(Math.random() * 24) + '-' + Math.floor(Math.random() * 60) + '-' + Math.floor(Math.random() * 60);
            return moment(publishText, 'YYYY-MM-DD H-m-s').toDate();
        }
        catch (e) {
            console.log('get date error for ' + id + ', try again', e);
            getVideoDate(id);
        }
    });
}
function getChannelDesc(id) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = (yield axios_1.default.get('https://m.youtube.com/channel/' + encodeURI(id) + '/videos', headers)).data;
            const raw = ((_a = mobileRegex.exec(body)) === null || _a === void 0 ? void 0 : _a[1]) || '{}';
            const data = JSON.parse(raw);
            let description = ((_c = (_b = data.metadata) === null || _b === void 0 ? void 0 : _b.channelMetadataRenderer) === null || _c === void 0 ? void 0 : _c.description) || '';
            return description;
        }
        catch (e) {
            console.log('channel desc error for ' + id, e);
        }
    });
}
function searchVideo(terms, token) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let items = [];
            let videos = [];
            // initial videos search
            if (!token) {
                let body = (yield axios_1.default.get('https://m.youtube.com/results?sp=EgIQAQ%253D%253D&videoEmbeddable=true&search_query=' + terms, headers)).data;
                let raw = ((_a = mobileRegex.exec(body)) === null || _a === void 0 ? void 0 : _a[1]) || '{}';
                let datas = JSON.parse(raw).contents.sectionListRenderer;
                items = datas.contents[0].itemSectionRenderer.contents;
                token = ((_d = (_c = (_b = datas.continuations) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.reloadContinuationData) === null || _d === void 0 ? void 0 : _d.continuation) || '';
            }
            // more videos
            else {
                let data = (yield axios_1.default.get('https://youtube.com/browse_ajax?ctoken=' + token, headersAJAX)).data;
                items = ((_f = (_e = data[1].response.continuationContents) === null || _e === void 0 ? void 0 : _e.gridContinuation) === null || _f === void 0 ? void 0 : _f.items) || '';
                token = ((_l = (_k = (_j = (_h = (_g = data[1].response.continuationContents) === null || _g === void 0 ? void 0 : _g.gridContinuation) === null || _h === void 0 ? void 0 : _h.continuations) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.nextContinuationData) === null || _l === void 0 ? void 0 : _l.continuation) || '';
            }
            for (let i = 0; i < items.length; i++) {
                videos.push(yield formatVideo(items[i], true));
            }
            return {
                tracks: videos,
                token: token,
            };
        }
        catch (e) {
            console.log('search videos error, terms: ' + terms, e);
        }
    });
}
function searchChannel(terms, token) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let items = [];
            let channels = [];
            if (!token) {
                const body = (yield axios_1.default.get('https://m.youtube.com/results?sp=CAASAhAC&search_query=' + encodeURI(terms), headers)).data;
                const raw = ((_a = mobileRegex.exec(body)) === null || _a === void 0 ? void 0 : _a[1]) || '{}';
                const data = JSON.parse(raw);
                items = (_d = (_c = (_b = data.contents.sectionListRenderer) === null || _b === void 0 ? void 0 : _b.contents[0]) === null || _c === void 0 ? void 0 : _c.itemSectionRenderer) === null || _d === void 0 ? void 0 : _d.contents;
                token = ((_g = (_f = (_e = data.continuations) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.reloadContinuationData) === null || _g === void 0 ? void 0 : _g.continuation) || '';
            }
            else {
                let data = (yield axios_1.default.get('https://youtube.com/browse_ajax?ctoken=' + token, headersAJAX)).data;
                items = ((_j = (_h = data[1].response.continuationContents) === null || _h === void 0 ? void 0 : _h.gridContinuation) === null || _j === void 0 ? void 0 : _j.items) || '';
                token = ((_p = (_o = (_m = (_l = (_k = data[1].response.continuationContents) === null || _k === void 0 ? void 0 : _k.gridContinuation) === null || _l === void 0 ? void 0 : _l.continuations) === null || _m === void 0 ? void 0 : _m[0]) === null || _o === void 0 ? void 0 : _o.nextContinuationData) === null || _p === void 0 ? void 0 : _p.continuation) || '';
            }
            for (let i = 0; i < items.length; i++) {
                if (items[i].compactChannelRenderer) {
                    const item = items[i].compactChannelRenderer;
                    let avatarSmall = ((_q = item.thumbnail) === null || _q === void 0 ? void 0 : _q.thumbnails[0].url) || '';
                    let avatarBig = ((_r = item.thumbnail) === null || _r === void 0 ? void 0 : _r.thumbnails[1].url) || '';
                    avatarSmall = (avatarSmall.startsWith('//') ? 'https:' + avatarSmall : avatarSmall);
                    avatarBig = (avatarBig.startsWith('//') ? 'https:' + avatarBig : avatarBig);
                    const nbSubscriber = formatYoutubeCount((_s = item.subscriberCountText) === null || _s === void 0 ? void 0 : _s.runs[0].text);
                    const nbVideo = formatYoutubeCount((_t = item.videoCountText) === null || _t === void 0 ? void 0 : _t.runs[0].text);
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
                    channels.push({
                        name: item.correctedQuery.runs[0].text,
                        channel_id: 'didyoumean',
                        nb_videos: '0',
                        nb_subscriber: '0',
                        official: false,
                        channel_avatar_small: '',
                        channel_avatar_medium: '',
                    });
                    channels[i];
                }
            }
            return {
                channels: channels,
                token: token,
            };
        }
        catch (e) {
            console.log('search channel error, terms: ' + terms, e);
        }
    });
}
function getChannelVideos(id, published_after) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = (yield axios_1.default.get('https://m.youtube.com/channel/' + encodeURI(id) + '/videos', headers)).data;
            const raw = ((_a = mobileRegex.exec(body)) === null || _a === void 0 ? void 0 : _a[1]) || '{}';
            const data = JSON.parse(raw);
            const items = (_g = (_f = (_e = (_d = (_c = (_b = data.contents.singleColumnBrowseResultsRenderer) === null || _b === void 0 ? void 0 : _b.tabs[1]) === null || _c === void 0 ? void 0 : _c.tabRenderer) === null || _d === void 0 ? void 0 : _d.content) === null || _e === void 0 ? void 0 : _e.sectionListRenderer) === null || _f === void 0 ? void 0 : _f.contents[0]) === null || _g === void 0 ? void 0 : _g.itemSectionRenderer;
            let token = ((_k = (_j = (_h = items.continuations) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.nextContinuationData) === null || _k === void 0 ? void 0 : _k.continuation) || '';
            let videos = [];
            for (let i = 0; i < items.contents.length; i++) {
                let video = yield formatVideo(items.contents[i]);
                if (!published_after) {
                    videos.push(video);
                }
                else if (moment(video.publishedAt).isAfter(published_after) && published_after) {
                    videos.push(video);
                }
                else {
                    return videos;
                }
            }
            while (token !== '') {
                try {
                    wait(Math.floor(Math.random() * 300));
                    let data = (yield axios_1.default.get('https://youtube.com/browse_ajax?ctoken=' + token, headersAJAX)).data;
                    let newVideos = ((_p = (_o = (_m = (_l = data[1]) === null || _l === void 0 ? void 0 : _l.response) === null || _m === void 0 ? void 0 : _m.continuationContents) === null || _o === void 0 ? void 0 : _o.gridContinuation) === null || _p === void 0 ? void 0 : _p.items) || '';
                    token = ((_u = (_t = (_s = (_r = (_q = data[1].response.continuationContents) === null || _q === void 0 ? void 0 : _q.gridContinuation) === null || _r === void 0 ? void 0 : _r.continuations) === null || _s === void 0 ? void 0 : _s[0]) === null || _t === void 0 ? void 0 : _t.nextContinuationData) === null || _u === void 0 ? void 0 : _u.continuation) || '';
                    for (let i = 0; i < newVideos.length; i++) {
                        let video = yield formatVideo(newVideos[i]);
                        if (moment(video.publishedAt).isBefore(published_after) && published_after) {
                            return videos;
                        }
                        else {
                            videos.push(video);
                        }
                    }
                }
                catch (e) {
                    console.log(e);
                    token = '';
                }
            }
            return videos;
        }
        catch (e) {
            console.log('channel videos error for id: ' + id, e);
        }
    });
}
function formatVideo(video, speedDate) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (video.compactVideoRenderer || video.gridVideoRenderer) {
                video = video.compactVideoRenderer ? video.compactVideoRenderer : video.gridVideoRenderer;
                let id = video.videoId;
                let durationDatas = 0;
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
                    let splited = video.original_title.match(/([^,]*)-(.*)/);
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
                let minutes = parseInt(durationDatas[0]) * 60;
                let seconds = parseInt(durationDatas[1]);
                // Date formating
                let publishedAt = !speedDate ? yield getVideoDate(id) : ((_e = video.publishedTimeText) === null || _e === void 0 ? void 0 : _e.runs[0].text) || '';
                return {
                    id: id,
                    original_title: video.original_title.trim(),
                    title: video.title.trim(),
                    artist: video.artist.trim(),
                    duration: minutes + seconds,
                    publishedAt: publishedAt,
                };
            }
            else if (video.didYouMeanRenderer || video.showingResultsForRenderer) {
                video = video.didYouMeanRenderer ? video.didYouMeanRenderer : video.showingResultsForRenderer;
                return {
                    id: 'didyoumean',
                    title: video.correctedQuery.runs[0].text,
                    artist: '',
                    duration: 0,
                    publishedAt: '',
                };
            }
        }
        catch (e) {
            console.log(e);
        }
    });
}
module.exports = {
    getVideoDate,
    getChannelDesc,
    searchVideo,
    searchChannel,
    getChannelVideos,
};
