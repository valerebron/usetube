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
const mobileRegex = /var\ ytInitialData\ \=\ \'(.*)\'\;<\/script>/;
const dateRegex = /publishDate":"(.*)","ownerChannelName/;
function decodeHex(hex) {
    return hex.replace(/\\x22/g, '"').replace(/\\x7b/g, '{').replace(/\\x7d/g, '}').replace(/\\x5b/g, '[').replace(/\\x5d/g, ']').replace(/\\x3b/g, ';').replace(/\\x3d/g, '=').replace(/\\x27/g, '\'').replace(/\\\\/g, 'doubleAntiSlash').replace(/\\/g, '').replace(/doubleAntiSlash/g, '\\');
}
function wait() {
    let ms = Math.floor(Math.random() * 300);
    let start = new Date().getTime();
    let end = start;
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
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = (yield axios_1.default.get('https://m.youtube.com/watch?v=' + id, headers)).data;
            let publishText = ((_a = dateRegex.exec(body)) === null || _a === void 0 ? void 0 : _a[1]) || '{}';
            publishText += ' ' + Math.floor(Math.random() * 24) + '-' + Math.floor(Math.random() * 60) + '-' + Math.floor(Math.random() * 60);
            return moment(publishText, 'YYYY-MM-DD H-m-s').toDate();
        }
        catch (e) {
            // console.log('cannot get date for '+id+', try again')
            // console.log(e)
        }
    });
}
function getVideoDesc(id) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = (yield axios_1.default.get('https://m.youtube.com/watch?v=' + encodeURI(id), headers)).data;
            const raw = ((_a = mobileRegex.exec(body)) === null || _a === void 0 ? void 0 : _a[1]) || '{}';
            const data = JSON.parse(decodeHex(raw));
            let description = ((_k = (_j = (_h = (_g = (_f = (_e = (_d = (_c = (_b = data.contents) === null || _b === void 0 ? void 0 : _b.singleColumnWatchNextResults) === null || _c === void 0 ? void 0 : _c.results) === null || _d === void 0 ? void 0 : _d.results) === null || _e === void 0 ? void 0 : _e.contents[1]) === null || _f === void 0 ? void 0 : _f.itemSectionRenderer) === null || _g === void 0 ? void 0 : _g.contents[0]) === null || _h === void 0 ? void 0 : _h.slimVideoMetadataRenderer) === null || _j === void 0 ? void 0 : _j.description) === null || _k === void 0 ? void 0 : _k.runs) || '';
            return description;
        }
        catch (e) {
            // console.log('video desc error for '+id, e)
        }
    });
}
function getChannelDesc(id) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = (yield axios_1.default.get('https://m.youtube.com/channel/' + encodeURI(id) + '/videos', headers)).data;
            const raw = ((_a = mobileRegex.exec(body)) === null || _a === void 0 ? void 0 : _a[1]) || '{}';
            const data = JSON.parse(decodeHex(raw));
            let description = ((_c = (_b = data.metadata) === null || _b === void 0 ? void 0 : _b.channelMetadataRenderer) === null || _c === void 0 ? void 0 : _c.description) || '';
            return description;
        }
        catch (e) {
            // console.log('channel desc error for '+id, e)
        }
    });
}
function searchVideo(terms, token) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let items = [];
            let videos = [];
            let didyoumean = '';
            // initial videos search
            if (!token) {
                let body = (yield axios_1.default.get('https://m.youtube.com/results?sp=EgIQAQ%253D%253D&videoEmbeddable=true&search_query=' + encodeURI(terms), headers)).data;
                let raw = ((_a = mobileRegex.exec(body)) === null || _a === void 0 ? void 0 : _a[1]) || '{}';
                // let fs = require('fs'); fs.writeFile('wow.json', decodeHex(raw), (e)=>{console.log(e)})
                let datas = JSON.parse(decodeHex(raw)).contents.sectionListRenderer;
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
                let formated = yield formatVideo(items[i], true);
                if (formated.id === 'didyoumean') {
                    didyoumean = formated.title;
                }
                else {
                    videos.push(formated);
                }
            }
            return {
                tracks: videos,
                didyoumean: didyoumean,
                token: token,
            };
        }
        catch (e) {
            // console.log('search videos error, terms: '+terms, e)
        }
    });
}
function searchChannel(terms, token) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let items = [];
            let channels = [];
            let didyoumean = '';
            if (!token) {
                const body = (yield axios_1.default.get('https://m.youtube.com/results?sp=CAASAhAC&search_query=' + encodeURI(terms), headers)).data;
                const raw = ((_a = mobileRegex.exec(body)) === null || _a === void 0 ? void 0 : _a[1]) || '{}';
                const data = JSON.parse(decodeHex(raw));
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
            // console.log('search channel error, terms: '+terms, e)
        }
    });
}
function getChannelVideos(id, published_after) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = (yield axios_1.default.get('https://m.youtube.com/channel/' + id + '/videos', headers)).data;
            const raw = ((_a = mobileRegex.exec(body)) === null || _a === void 0 ? void 0 : _a[1]) || '{}';
            // let fs = require('fs'); fs.writeFile('wow.json', decodeHex(raw), (e)=>{console.log(e)})
            const data = JSON.parse(decodeHex(raw));
            const items = (_h = (_g = (_f = (_e = (_d = (_c = (_b = data.contents) === null || _b === void 0 ? void 0 : _b.singleColumnBrowseResultsRenderer) === null || _c === void 0 ? void 0 : _c.tabs[1]) === null || _d === void 0 ? void 0 : _d.tabRenderer) === null || _e === void 0 ? void 0 : _e.content) === null || _f === void 0 ? void 0 : _f.sectionListRenderer) === null || _g === void 0 ? void 0 : _g.contents[0]) === null || _h === void 0 ? void 0 : _h.itemSectionRenderer;
            let token = ((_l = (_k = (_j = items.continuations) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.nextContinuationData) === null || _l === void 0 ? void 0 : _l.continuation) || '';
            let videos = [];
            for (let i = 0; i < items.contents.length; i++) {
                let video = yield formatVideo(items.contents[i]);
                if (moment(video.publishedAt).isBefore(published_after) && published_after) {
                    return videos;
                }
                else {
                    videos.push(video);
                }
            }
            while (token !== '') {
                try {
                    wait();
                    let data = (yield axios_1.default.get('https://youtube.com/browse_ajax?ctoken=' + token, headersAJAX)).data;
                    let newVideos = ((_q = (_p = (_o = (_m = data[1]) === null || _m === void 0 ? void 0 : _m.response) === null || _o === void 0 ? void 0 : _o.continuationContents) === null || _p === void 0 ? void 0 : _p.gridContinuation) === null || _q === void 0 ? void 0 : _q.items) || '';
                    token = ((_v = (_u = (_t = (_s = (_r = data[1].response.continuationContents) === null || _r === void 0 ? void 0 : _r.gridContinuation) === null || _s === void 0 ? void 0 : _s.continuations) === null || _t === void 0 ? void 0 : _t[0]) === null || _u === void 0 ? void 0 : _u.nextContinuationData) === null || _v === void 0 ? void 0 : _v.continuation) || '';
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
                    console.log('getChannelVideos failed');
                    console.log(e);
                    token = '';
                }
            }
            return videos;
        }
        catch (e) {
            console.log('cannot get channel videos for id: ' + id + ', try again');
            // getChannelVideos(id, published_after)
        }
    });
}
function getPlaylistVideos(id, speedDate) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = (yield axios_1.default.get('https://m.youtube.com/playlist?list=' + id, headers)).data;
            const raw = ((_a = mobileRegex.exec(body)) === null || _a === void 0 ? void 0 : _a[1]) || '{}';
            const data = JSON.parse(decodeHex(raw));
            const items = ((_k = (_j = (_h = (_g = (_f = (_e = (_d = (_c = (_b = data.contents) === null || _b === void 0 ? void 0 : _b.singleColumnBrowseResultsRenderer) === null || _c === void 0 ? void 0 : _c.tabs[0]) === null || _d === void 0 ? void 0 : _d.tabRenderer) === null || _e === void 0 ? void 0 : _e.content) === null || _f === void 0 ? void 0 : _f.sectionListRenderer) === null || _g === void 0 ? void 0 : _g.contents[0]) === null || _h === void 0 ? void 0 : _h.itemSectionRenderer) === null || _j === void 0 ? void 0 : _j.contents[0]) === null || _k === void 0 ? void 0 : _k.playlistVideoListRenderer) || '';
            let token = ((_l = items.continuations[0]) === null || _l === void 0 ? void 0 : _l.nextContinuationData.continuation) || '';
            let videos = [];
            for (let i = 0; i < items.contents.length; i++) {
                videos.push(yield formatVideo(items.contents[i]), speedDate);
            }
            while (token !== '') {
                try {
                    wait();
                    const body = (yield axios_1.default.get('https://m.youtube.com/playlist?ctoken=' + token, headers)).data;
                    let nextRaw = ((_m = mobileRegex.exec(body)) === null || _m === void 0 ? void 0 : _m[1]) || '{}';
                    let nextData = JSON.parse(decodeHex(nextRaw)).continuationContents.playlistVideoListContinuation;
                    let nextVideos = nextData.contents;
                    if (nextData.continuations) {
                        token = (_o = nextData.continuations[0]) === null || _o === void 0 ? void 0 : _o.nextContinuationData.continuation;
                    }
                    else {
                        token = '';
                    }
                    for (let i = 0; i < nextVideos.length; i++) {
                        videos.push(yield formatVideo(nextVideos[i]), speedDate);
                    }
                }
                catch (e) {
                    console.log('getPlaylistVideos failed');
                    console.log(e);
                    token = '';
                }
            }
            return videos;
        }
        catch (e) {
            console.log('cannot get playlist ' + id + ', try again');
            console.log(e);
        }
    });
}
function formatVideo(video, speedDate) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (video.compactVideoRenderer || video.gridVideoRenderer || video.playlistVideoRenderer) {
                if (video.compactVideoRenderer) {
                    video = video.compactVideoRenderer;
                }
                else if (video.gridVideoRenderer) {
                    video = video.gridVideoRenderer;
                }
                else if (video.playlistVideoRenderer) {
                    video = video.playlistVideoRenderer;
                }
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
            console.log('format video failed');
            // console.log(e)
        }
    });
}
module.exports = {
    getVideoDate,
    getVideoDesc,
    getChannelDesc,
    searchVideo,
    searchChannel,
    getChannelVideos,
    getPlaylistVideos,
};
