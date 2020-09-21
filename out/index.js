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
const axios_1 = require("axios");
const moment = require("moment");
const usetube = {
    getVideoDate,
    getChannelDesc,
    searchVideo,
    searchChannel,
    getChannelVideos,
};
exports.default = usetube;
const headers = { headers: {
        'x-youtube-client-name': 1,
        'x-youtube-client-version': '2.20200911.04.00',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Mobile Safari/537.36',
    } };
const headersAJAX = { headers: {
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
                    channels.push({
                        name: item.title.runs[0].text,
                        channel_id: item.channelId,
                        nb_videos: ((_s = item.videoCountText) === null || _s === void 0 ? void 0 : _s.runs[0].text.replace(/[^0-9k]/g, '').replace('k', '000')) || 0,
                        nb_subscriber: ((_t = item.subscriberCountText) === null || _t === void 0 ? void 0 : _t.runs[0].text.replace(/[^0-9k]/g, '').replace('k', '000')) || 0,
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
                    wait(Math.floor(Math.random() * 500));
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
                video.title = cleanTitle(video.title);
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
                    original_title: video.original_title,
                    title: video.title,
                    artist: video.artist,
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
function cleanTitle(title) {
    const braketsRegex = /\[[^)]*\]/;
    let forbidenTerms = ['(full album)', '(official ep)', '(official video)', '(radio edit)',];
    title = title.replace(braketsRegex, '');
    forbidenTerms.forEach(forbidenTerm => {
        title = title.replace(new RegExp(forbidenTerm, 'ig'), '');
        title = title.replace('()', '');
    });
    return title;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxpQ0FBaUQ7QUFDakQsaUNBQWdDO0FBRWhDLE1BQU0sT0FBTyxHQUFHO0lBQ2QsWUFBWTtJQUNaLGNBQWM7SUFDZCxXQUFXO0lBQ1gsYUFBYTtJQUNiLGdCQUFnQjtDQUNqQixDQUFBO0FBRUQsa0JBQWUsT0FBTyxDQUFBO0FBRXRCLE1BQU0sT0FBTyxHQUF1QixFQUFDLE9BQU8sRUFBRTtRQUM1Qyx1QkFBdUIsRUFBRSxDQUFDO1FBQzFCLDBCQUEwQixFQUFFLGtCQUFrQjtRQUM5QyxZQUFZLEVBQUUseUlBQXlJO0tBQ3hKLEVBQUMsQ0FBQTtBQUVGLE1BQU0sV0FBVyxHQUF1QixFQUFDLE9BQU8sRUFBRTtRQUNoRCxZQUFZLEVBQUUsYUFBYTtRQUMzQix1QkFBdUIsRUFBRSxDQUFDO1FBQzFCLDBCQUEwQixFQUFFLGtCQUFrQjtLQUMvQyxFQUFDLENBQUE7QUFFRixNQUFNLFVBQVUsR0FBRywyREFBMkQsQ0FBQTtBQUM5RSxNQUFNLFdBQVcsR0FBSSxzRUFBc0UsQ0FBQTtBQUUzRixTQUFTLElBQUksQ0FBQyxFQUFFO0lBQ2QsSUFBSSxLQUFLLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNqQyxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUM7SUFDaEIsT0FBTSxHQUFHLEdBQUcsS0FBSyxHQUFHLEVBQUUsRUFBRTtRQUN0QixHQUFHLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUM3QjtBQUNGLENBQUM7QUFFRCxTQUFlLFlBQVksQ0FBQyxFQUFVOzs7UUFDcEMsSUFBSTtZQUNGLE1BQU0sSUFBSSxHQUFRLENBQUMsTUFBTSxlQUFLLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxHQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFD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O1FBQ25DLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksTUFBTSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUN6RCxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUE7SUFDakMsQ0FBQyxDQUFDLENBQUE7SUFDRixPQUFPLEtBQUssQ0FBQTtBQUNkLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXhpb3MsIHsgQXhpb3NSZXF1ZXN0Q29uZmlnIH0gZnJvbSAnYXhpb3MnXG5pbXBvcnQgKiBhcyBtb21lbnQgZnJvbSAnbW9tZW50J1xuXG5jb25zdCB1c2V0dWJlID0ge1xuICBnZXRWaWRlb0RhdGUsXG4gIGdldENoYW5uZWxEZXNjLFxuICBzZWFyY2hWaWRlbyxcbiAgc2VhcmNoQ2hhbm5lbCxcbiAgZ2V0Q2hhbm5lbFZpZGVvcyxcbn1cblxuZXhwb3J0IGRlZmF1bHQgdXNldHViZVxuXG5jb25zdCBoZWFkZXJzOiBBeGlvc1JlcXVlc3RDb25maWcgPSB7aGVhZGVyczoge1xuICAneC15b3V0dWJlLWNsaWVudC1uYW1lJzogMSxcbiAgJ3gteW91dHViZS1jbGllbnQtdmVyc2lvbic6ICcyLjIwMjAwOTExLjA0LjAwJyxcbiAgJ1VzZXItQWdlbnQnOiAnTW96aWxsYS81LjAgKExpbnV4OyBBbmRyb2lkIDUuMDsgU00tRzkwMFAgQnVpbGQvTFJYMjFUKSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvNjcuMC4zMzk2Ljg3IE1vYmlsZSBTYWZhcmkvNTM3LjM2Jyxcbn19XG5cbmNvbnN0IGhlYWRlcnNBSkFYOiBBeGlvc1JlcXVlc3RDb25maWcgPSB7aGVhZGVyczoge1xuICAnVXNlci1BZ2VudCc6ICdoZWxsb2JpY3plcycsXG4gICd4LXlvdXR1YmUtY2xpZW50LW5hbWUnOiAxLFxuICAneC15b3V0dWJlLWNsaWVudC12ZXJzaW9uJzogJzIuMjAyMDA3MzEuMDIuMDEnXG59fVxuXG5jb25zdCB2aWRlb1JlZ2V4ID0gL3l0SW5pdGlhbFBsYXllckNvbmZpZ1xcIFxcPVxcICguKilcXDtcXG5cXCBcXCBcXCBcXCBcXCBcXCBzZXRUaW1lb3V0L1xuY29uc3QgbW9iaWxlUmVnZXggID0gL2lkXFw9XFxcImluaXRpYWxcXC1kYXRhXFxcIlxcPlxcPFxcIVxcLVxcLVxcICguKilcXCBcXC1cXC1cXD5cXDxcXC9kaXZcXD5cXDxzY3JpcHRcXCBcXD5pZi9cblxuZnVuY3Rpb24gd2FpdChtcyl7XG4gIHZhciBzdGFydCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICB2YXIgZW5kID0gc3RhcnQ7XG4gIHdoaWxlKGVuZCA8IHN0YXJ0ICsgbXMpIHtcbiAgICBlbmQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldFZpZGVvRGF0ZShpZDogc3RyaW5nKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgYm9keTogYW55ID0gKGF3YWl0IGF4aW9zLmdldCgnaHR0cHM6Ly9tLnlvdXR1YmUuY29tL3dhdGNoP3Y9JytpZCwgaGVhZGVycykpLmRhdGEgYXMgc3RyaW5nXG4gICAgY29uc3QgcmF3OiBhbnkgPSB2aWRlb1JlZ2V4LmV4ZWMoYm9keSkgPy5bMV0gfHwgJ3t9J1xuICAgIGNvbnN0IGRhdGFzOiBhbnkgPSBKU09OLnBhcnNlKHJhdylcbiAgICBsZXQgcHVibGlzaFRleHQ6IGFueSA9IEpTT04ucGFyc2UoZGF0YXMuYXJncy5wbGF5ZXJfcmVzcG9uc2UpLm1pY3JvZm9ybWF0Py5wbGF5ZXJNaWNyb2Zvcm1hdFJlbmRlcmVyPy5wdWJsaXNoRGF0ZVxuICAgIHB1Ymxpc2hUZXh0ICs9ICcgJytNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyNCkrJy0nK01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDYwKSsnLScrTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNjApXG4gICAgcmV0dXJuIG1vbWVudChwdWJsaXNoVGV4dCwgJ1lZWVktTU0tREQgSC1tLXMnKS50b0RhdGUoKVxuICB9IGNhdGNoKGUpIHtcbiAgICBjb25zb2xlLmxvZygnZ2V0IGRhdGUgZXJyb3IgZm9yICcraWQrJywgdHJ5IGFnYWluJywgZSlcbiAgICBnZXRWaWRlb0RhdGUoaWQpXG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0Q2hhbm5lbERlc2MoaWQ6IHN0cmluZykge1xuICB0cnkge1xuICAgIGNvbnN0IGJvZHk6IGFueSA9IChhd2FpdCBheGlvcy5nZXQoJ2h0dHBzOi8vbS55b3V0dWJlLmNvbS9jaGFubmVsLycrZW5jb2RlVVJJKGlkKSsnL3ZpZGVvcycsIGhlYWRlcnMpKS5kYXRhIGFzIHN0cmluZ1xuICAgIGNvbnN0IHJhdzogYW55ID0gbW9iaWxlUmVnZXguZXhlYyhib2R5KSA/LlsxXSB8fCAne30nXG4gICAgY29uc3QgZGF0YTogYW55ID0gSlNPTi5wYXJzZShyYXcpXG4gICAgbGV0IGRlc2NyaXB0aW9uOiBzdHJpbmcgPSBkYXRhLm1ldGFkYXRhPy5jaGFubmVsTWV0YWRhdGFSZW5kZXJlcj8uZGVzY3JpcHRpb24gfHwgJydcbiAgICByZXR1cm4gZGVzY3JpcHRpb25cbiAgfSBjYXRjaChlKSB7XG4gICAgY29uc29sZS5sb2coJ2NoYW5uZWwgZGVzYyBlcnJvciBmb3IgJytpZCwgZSlcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBzZWFyY2hWaWRlbyh0ZXJtczogc3RyaW5nLCB0b2tlbj86IHN0cmluZykge1xuICB0cnkge1xuICAgIGxldCBpdGVtczogYW55ID0gW11cbiAgICBsZXQgdmlkZW9zOiBhbnkgPSBbXVxuICAgIC8vIGluaXRpYWwgdmlkZW9zIHNlYXJjaFxuICAgIGlmKCF0b2tlbikge1xuICAgICAgbGV0IGJvZHk6IGFueSA9IChhd2FpdCBheGlvcy5nZXQoJ2h0dHBzOi8vbS55b3V0dWJlLmNvbS9yZXN1bHRzP3NwPUVnSVFBUSUyNTNEJTI1M0QmdmlkZW9FbWJlZGRhYmxlPXRydWUmc2VhcmNoX3F1ZXJ5PScrdGVybXMsIGhlYWRlcnMpKS5kYXRhIGFzIHN0cmluZ1xuICAgICAgbGV0IHJhdzogYW55ID0gbW9iaWxlUmVnZXguZXhlYyhib2R5KSA/LlsxXSB8fCAne30nXG4gICAgICBsZXQgZGF0YXM6IGFueSA9IEpTT04ucGFyc2UocmF3KS5jb250ZW50cy5zZWN0aW9uTGlzdFJlbmRlcmVyXG4gICAgICBpdGVtcyA9IGRhdGFzLmNvbnRlbnRzWzBdLml0ZW1TZWN0aW9uUmVuZGVyZXIuY29udGVudHNcbiAgICAgIHRva2VuID0gZGF0YXMuY29udGludWF0aW9ucz8uWzBdPy5yZWxvYWRDb250aW51YXRpb25EYXRhPy5jb250aW51YXRpb24gfHwgJydcbiAgICB9XG4gICAgLy8gbW9yZSB2aWRlb3NcbiAgICBlbHNlIHtcbiAgICAgIGxldCBkYXRhID0gKGF3YWl0IGF4aW9zLmdldCgnaHR0cHM6Ly95b3V0dWJlLmNvbS9icm93c2VfYWpheD9jdG9rZW49Jyt0b2tlbiwgaGVhZGVyc0FKQVgpKS5kYXRhXG4gICAgICBpdGVtcyA9IGRhdGFbMV0ucmVzcG9uc2UuY29udGludWF0aW9uQ29udGVudHM/LmdyaWRDb250aW51YXRpb24/Lml0ZW1zIHx8ICcnXG4gICAgICB0b2tlbiA9IGRhdGFbMV0ucmVzcG9uc2UuY29udGludWF0aW9uQ29udGVudHM/LmdyaWRDb250aW51YXRpb24/LmNvbnRpbnVhdGlvbnM/LlswXT8ubmV4dENvbnRpbnVhdGlvbkRhdGE/LmNvbnRpbnVhdGlvbiB8fCAnJ1xuICAgIH1cbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZpZGVvcy5wdXNoKGF3YWl0IGZvcm1hdFZpZGVvKGl0ZW1zW2ldLCB0cnVlKSlcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHRyYWNrczogdmlkZW9zLFxuICAgICAgdG9rZW46IHRva2VuLFxuICAgIH1cbiAgfSBjYXRjaChlKSB7XG4gICAgY29uc29sZS5sb2coJ3NlYXJjaCB2aWRlb3MgZXJyb3IsIHRlcm1zOiAnK3Rlcm1zLCBlKVxuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNlYXJjaENoYW5uZWwodGVybXM6IHN0cmluZywgdG9rZW4/OiBzdHJpbmcpIHtcbiAgdHJ5IHtcbiAgICBsZXQgaXRlbXM6IGFueSA9IFtdXG4gICAgbGV0IGNoYW5uZWxzOiBhbnkgPSBbXVxuICAgIGlmKCF0b2tlbikge1xuICAgICAgY29uc3QgYm9keTogYW55ID0gKGF3YWl0IGF4aW9zLmdldCgnaHR0cHM6Ly9tLnlvdXR1YmUuY29tL3Jlc3VsdHM/c3A9Q0FBU0FoQUMmc2VhcmNoX3F1ZXJ5PScrZW5jb2RlVVJJKHRlcm1zKSwgaGVhZGVycykpLmRhdGEgYXMgc3RyaW5nXG4gICAgICBjb25zdCByYXc6IGFueSA9IG1vYmlsZVJlZ2V4LmV4ZWMoYm9keSkgPy5bMV0gfHwgJ3t9J1xuICAgICAgY29uc3QgZGF0YTogYW55ID0gSlNPTi5wYXJzZShyYXcpXG4gICAgICBpdGVtcyA9IGRhdGEuY29udGVudHMuc2VjdGlvbkxpc3RSZW5kZXJlcj8uY29udGVudHNbMF0/Lml0ZW1TZWN0aW9uUmVuZGVyZXI/LmNvbnRlbnRzICBcbiAgICAgIHRva2VuID0gZGF0YS5jb250aW51YXRpb25zPy5bMF0/LnJlbG9hZENvbnRpbnVhdGlvbkRhdGE/LmNvbnRpbnVhdGlvbiB8fCAnJ1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGxldCBkYXRhID0gKGF3YWl0IGF4aW9zLmdldCgnaHR0cHM6Ly95b3V0dWJlLmNvbS9icm93c2VfYWpheD9jdG9rZW49Jyt0b2tlbiwgaGVhZGVyc0FKQVgpKS5kYXRhXG4gICAgICBpdGVtcyA9IGRhdGFbMV0ucmVzcG9uc2UuY29udGludWF0aW9uQ29udGVudHM/LmdyaWRDb250aW51YXRpb24/Lml0ZW1zIHx8ICcnXG4gICAgICB0b2tlbiA9IGRhdGFbMV0ucmVzcG9uc2UuY29udGludWF0aW9uQ29udGVudHM/LmdyaWRDb250aW51YXRpb24/LmNvbnRpbnVhdGlvbnM/LlswXT8ubmV4dENvbnRpbnVhdGlvbkRhdGE/LmNvbnRpbnVhdGlvbiB8fCAnJ1xuICAgIH1cbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmKGl0ZW1zW2ldLmNvbXBhY3RDaGFubmVsUmVuZGVyZXIpIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IGl0ZW1zW2ldLmNvbXBhY3RDaGFubmVsUmVuZGVyZXJcbiAgICAgICAgbGV0IGF2YXRhclNtYWxsID0gaXRlbS50aHVtYm5haWw/LnRodW1ibmFpbHNbMF0udXJsIHx8ICcnXG4gICAgICAgIGxldCBhdmF0YXJCaWcgICA9IGl0ZW0udGh1bWJuYWlsPy50aHVtYm5haWxzWzFdLnVybCB8fCAnJ1xuICAgICAgICBhdmF0YXJTbWFsbCA9IChhdmF0YXJTbWFsbC5zdGFydHNXaXRoKCcvLycpID8gJ2h0dHBzOicrYXZhdGFyU21hbGwgOiBhdmF0YXJTbWFsbClcbiAgICAgICAgYXZhdGFyQmlnID0gKGF2YXRhckJpZy5zdGFydHNXaXRoKCcvLycpID8gJ2h0dHBzOicrYXZhdGFyQmlnIDogYXZhdGFyQmlnKVxuICAgICAgICBjaGFubmVscy5wdXNoKHtcbiAgICAgICAgICBuYW1lOiAgICAgICAgICAgICAgICAgIGl0ZW0udGl0bGUucnVuc1swXS50ZXh0LFxuICAgICAgICAgIGNoYW5uZWxfaWQ6ICAgICAgICAgICAgaXRlbS5jaGFubmVsSWQsXG4gICAgICAgICAgbmJfdmlkZW9zOiAgICAgICAgICAgICBpdGVtLnZpZGVvQ291bnRUZXh0Py5ydW5zWzBdLnRleHQucmVwbGFjZSgvW14wLTlrXS9nLCAnJykucmVwbGFjZSgnaycsICcwMDAnKSB8fCAwLFxuICAgICAgICAgIG5iX3N1YnNjcmliZXI6ICAgICAgICAgaXRlbS5zdWJzY3JpYmVyQ291bnRUZXh0Py5ydW5zWzBdLnRleHQucmVwbGFjZSgvW14wLTlrXS9nLCAnJykucmVwbGFjZSgnaycsICcwMDAnKSB8fCAwLFxuICAgICAgICAgIG9mZmljaWFsOiAgICAgICAgICAgICAgKGl0ZW0ub3duZXJCYWRnZXMgPyB0cnVlIDogZmFsc2UpLFxuICAgICAgICAgIGNoYW5uZWxfYXZhdGFyX3NtYWxsOiAgYXZhdGFyU21hbGwsXG4gICAgICAgICAgY2hhbm5lbF9hdmF0YXJfbWVkaXVtOiBhdmF0YXJCaWcsXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICBlbHNlIGlmKGl0ZW1zW2ldLmRpZFlvdU1lYW5SZW5kZXJlciB8fCBpdGVtc1tpXS5zaG93aW5nUmVzdWx0c0ZvclJlbmRlcmVyKSB7XG4gICAgICAgIGxldCBpdGVtOiBhbnlcbiAgICAgICAgaWYoaXRlbXNbaV0uZGlkWW91TWVhblJlbmRlcmVyKSB7XG4gICAgICAgICAgaXRlbSA9IGl0ZW1zW2ldLmRpZFlvdU1lYW5SZW5kZXJlclxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGl0ZW0gPSBpdGVtc1tpXS5zaG93aW5nUmVzdWx0c0ZvclJlbmRlcmVyXG4gICAgICAgIH1cbiAgICAgICAgY2hhbm5lbHMucHVzaCh7XG4gICAgICAgICAgbmFtZTogICAgICAgICAgICAgICAgICBpdGVtLmNvcnJlY3RlZFF1ZXJ5LnJ1bnNbMF0udGV4dCxcbiAgICAgICAgICBjaGFubmVsX2lkOiAgICAgICAgICAgICdkaWR5b3VtZWFuJyxcbiAgICAgICAgICBuYl92aWRlb3M6ICAgICAgICAgICAgICcwJyxcbiAgICAgICAgICBuYl9zdWJzY3JpYmVyOiAgICAgICAgICcwJyxcbiAgICAgICAgICBvZmZpY2lhbDogICAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgIGNoYW5uZWxfYXZhdGFyX3NtYWxsOiAgJycsXG4gICAgICAgICAgY2hhbm5lbF9hdmF0YXJfbWVkaXVtOiAnJyxcbiAgICAgICAgfSlcbiAgICAgICAgY2hhbm5lbHNbaV1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGNoYW5uZWxzOiBjaGFubmVscyxcbiAgICAgIHRva2VuOiB0b2tlbixcbiAgICB9XG4gIH0gY2F0Y2goZSkge1xuICAgIGNvbnNvbGUubG9nKCdzZWFyY2ggY2hhbm5lbCBlcnJvciwgdGVybXM6ICcrdGVybXMsIGUpXG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0Q2hhbm5lbFZpZGVvcyhpZDogc3RyaW5nLCBwdWJsaXNoZWRfYWZ0ZXI/OiBEYXRlKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgYm9keTogYW55ID0gKGF3YWl0IGF4aW9zLmdldCgnaHR0cHM6Ly9tLnlvdXR1YmUuY29tL2NoYW5uZWwvJytlbmNvZGVVUkkoaWQpKycvdmlkZW9zJywgaGVhZGVycykpLmRhdGEgYXMgc3RyaW5nXG4gICAgY29uc3QgcmF3OiBhbnkgPSBtb2JpbGVSZWdleC5leGVjKGJvZHkpID8uWzFdIHx8ICd7fSdcbiAgICBjb25zdCBkYXRhOiBhbnkgPSBKU09OLnBhcnNlKHJhdylcbiAgICBjb25zdCBpdGVtczogYW55ID0gZGF0YS5jb250ZW50cy5zaW5nbGVDb2x1bW5Ccm93c2VSZXN1bHRzUmVuZGVyZXI/LnRhYnNbMV0/LnRhYlJlbmRlcmVyPy5jb250ZW50Py5zZWN0aW9uTGlzdFJlbmRlcmVyPy5jb250ZW50c1swXT8uaXRlbVNlY3Rpb25SZW5kZXJlclxuICAgIGxldCB0b2tlbjogc3RyaW5nID0gaXRlbXMuY29udGludWF0aW9ucz8uWzBdPy5uZXh0Q29udGludWF0aW9uRGF0YT8uY29udGludWF0aW9uIHx8ICcnXG4gICAgbGV0IHZpZGVvczogYW55ID0gW11cbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgaXRlbXMuY29udGVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCB2aWRlbyA9IGF3YWl0IGZvcm1hdFZpZGVvKGl0ZW1zLmNvbnRlbnRzW2ldKVxuICAgICAgaWYoIXB1Ymxpc2hlZF9hZnRlcikge1xuICAgICAgICB2aWRlb3MucHVzaCh2aWRlbylcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYobW9tZW50KHZpZGVvLnB1Ymxpc2hlZEF0KS5pc0FmdGVyKHB1Ymxpc2hlZF9hZnRlcikgJiYgcHVibGlzaGVkX2FmdGVyKSB7XG4gICAgICAgIHZpZGVvcy5wdXNoKHZpZGVvKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJldHVybiB2aWRlb3NcbiAgICAgIH1cbiAgICB9XG4gICAgd2hpbGUodG9rZW4gIT09ICcnKSB7XG4gICAgICB0cnkge1xuICAgICAgICB3YWl0KE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUwMCkpXG4gICAgICAgIGxldCBkYXRhID0gKGF3YWl0IGF4aW9zLmdldCgnaHR0cHM6Ly95b3V0dWJlLmNvbS9icm93c2VfYWpheD9jdG9rZW49Jyt0b2tlbiwgaGVhZGVyc0FKQVgpKS5kYXRhXG4gICAgICAgIGxldCBuZXdWaWRlb3M6IGFueSA9IGRhdGFbMV0/LnJlc3BvbnNlPy5jb250aW51YXRpb25Db250ZW50cz8uZ3JpZENvbnRpbnVhdGlvbj8uaXRlbXMgfHwgJydcbiAgICAgICAgdG9rZW4gPSBkYXRhWzFdLnJlc3BvbnNlLmNvbnRpbnVhdGlvbkNvbnRlbnRzPy5ncmlkQ29udGludWF0aW9uPy5jb250aW51YXRpb25zPy5bMF0/Lm5leHRDb250aW51YXRpb25EYXRhPy5jb250aW51YXRpb24gfHwgJydcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IG5ld1ZpZGVvcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGxldCB2aWRlbyA9IGF3YWl0IGZvcm1hdFZpZGVvKG5ld1ZpZGVvc1tpXSlcbiAgICAgICAgICBpZihtb21lbnQodmlkZW8ucHVibGlzaGVkQXQpLmlzQmVmb3JlKHB1Ymxpc2hlZF9hZnRlcikgJiYgcHVibGlzaGVkX2FmdGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdmlkZW9zXG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmlkZW9zLnB1c2godmlkZW8pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coZSlcbiAgICAgICAgdG9rZW4gPSAnJ1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdmlkZW9zXG4gIH0gY2F0Y2goZSkge1xuICAgIGNvbnNvbGUubG9nKCdjaGFubmVsIHZpZGVvcyBlcnJvciBmb3IgaWQ6ICcraWQsIGUpXG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZm9ybWF0VmlkZW8odmlkZW86IGFueSwgc3BlZWREYXRlPzogYm9vbGVhbikge1xuICB0cnl7XG4gICAgaWYodmlkZW8uY29tcGFjdFZpZGVvUmVuZGVyZXIgfHwgdmlkZW8uZ3JpZFZpZGVvUmVuZGVyZXIpIHtcbiAgICAgIHZpZGVvID0gdmlkZW8uY29tcGFjdFZpZGVvUmVuZGVyZXIgPyB2aWRlby5jb21wYWN0VmlkZW9SZW5kZXJlciA6IHZpZGVvLmdyaWRWaWRlb1JlbmRlcmVyXG4gICAgICBsZXQgaWQ6IHN0cmluZyA9IHZpZGVvLnZpZGVvSWRcbiAgICAgIGxldCBkdXJhdGlvbkRhdGFzOiBhbnkgPSAwXG4gICAgICAvLyBnZXQgdGl0bGVcbiAgICAgIGlmKHZpZGVvLnRpdGxlLnNpbXBsZVRleHQpIHtcbiAgICAgICAgdmlkZW8udGl0bGUgPSB2aWRlby50aXRsZS5zaW1wbGVUZXh0XG4gICAgICB9XG4gICAgICBlbHNlIGlmKHZpZGVvLnRpdGxlLnJ1bnNbMF0udGV4dCkge1xuICAgICAgICB2aWRlby50aXRsZSA9IHZpZGVvLnRpdGxlLnJ1bnNbMF0udGV4dFxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHZpZGVvLnRpdGxlID0gJydcbiAgICAgIH1cbiAgICAgIC8vIHRpdGxlIGZvcm1hdGluZ1xuICAgICAgdmlkZW8ub3JpZ2luYWxfdGl0bGUgPSB2aWRlby50aXRsZVxuICAgICAgdmlkZW8udGl0bGUgPSBjbGVhblRpdGxlKHZpZGVvLnRpdGxlKVxuXG4gICAgICBpZih2aWRlby50aXRsZS5zcGxpdCgnLScpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICB2aWRlby5hcnRpc3QgPSAnJ1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGxldCBzcGxpdGVkID0gdmlkZW8ub3JpZ2luYWxfdGl0bGUubWF0Y2goLyhbXixdKiktKC4qKS8pXG4gICAgICAgIHZpZGVvLmFydGlzdCA9IHNwbGl0ZWRbMV1cbiAgICAgICAgdmlkZW8udGl0bGUgPSBzcGxpdGVkWzJdXG4gICAgICB9XG4gICAgICAvLyBkdXJhdGlvbiBmb3JtYXRpbmdcbiAgICAgIGlmKHZpZGVvLmxlbmd0aFRleHQpIHtcbiAgICAgICAgZHVyYXRpb25EYXRhcyA9IHZpZGVvLmxlbmd0aFRleHQucnVuc1swXS50ZXh0LnNwbGl0KCc6JylcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYodmlkZW8udGh1bWJuYWlsT3ZlcmxheXNbMF0/LnRodW1ibmFpbE92ZXJsYXlUaW1lU3RhdHVzUmVuZGVyZXI/LnRleHQuc2ltcGxlVGV4dCkge1xuICAgICAgICBkdXJhdGlvbkRhdGFzID0gdmlkZW8udGh1bWJuYWlsT3ZlcmxheXNbMF0/LnRodW1ibmFpbE92ZXJsYXlUaW1lU3RhdHVzUmVuZGVyZXI/LnRleHQuc2ltcGxlVGV4dC5zcGxpdCgnOicpICB8fCAnJ1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGR1cmF0aW9uRGF0YXMgPSBbMCwwXVxuICAgICAgfVxuICAgICAgbGV0IG1pbnV0ZXM6IG51bWJlciA9IHBhcnNlSW50KGR1cmF0aW9uRGF0YXNbMF0pICogNjBcbiAgICAgIGxldCBzZWNvbmRzOiBudW1iZXIgPSBwYXJzZUludChkdXJhdGlvbkRhdGFzWzFdKVxuICAgICAgLy8gRGF0ZSBmb3JtYXRpbmdcbiAgICAgIGxldCBwdWJsaXNoZWRBdCA9ICFzcGVlZERhdGUgPyBhd2FpdCBnZXRWaWRlb0RhdGUoaWQpIDogdmlkZW8ucHVibGlzaGVkVGltZVRleHQ/LnJ1bnNbMF0udGV4dCB8fCAnJ1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaWQ6ICBpZCxcbiAgICAgICAgb3JpZ2luYWxfdGl0bGU6IHZpZGVvLm9yaWdpbmFsX3RpdGxlLFxuICAgICAgICB0aXRsZTpcdHZpZGVvLnRpdGxlLFxuICAgICAgICBhcnRpc3Q6IHZpZGVvLmFydGlzdCxcbiAgICAgICAgZHVyYXRpb246XHRtaW51dGVzK3NlY29uZHMsXG4gICAgICAgIHB1Ymxpc2hlZEF0OiBwdWJsaXNoZWRBdCxcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZih2aWRlby5kaWRZb3VNZWFuUmVuZGVyZXIgfHwgdmlkZW8uc2hvd2luZ1Jlc3VsdHNGb3JSZW5kZXJlcikge1xuICAgICAgdmlkZW8gPSB2aWRlby5kaWRZb3VNZWFuUmVuZGVyZXIgPyB2aWRlby5kaWRZb3VNZWFuUmVuZGVyZXIgOiB2aWRlby5zaG93aW5nUmVzdWx0c0ZvclJlbmRlcmVyXG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogICdkaWR5b3VtZWFuJyxcbiAgICAgICAgdGl0bGU6XHR2aWRlby5jb3JyZWN0ZWRRdWVyeS5ydW5zWzBdLnRleHQsXG4gICAgICAgIGFydGlzdDogJycsXG4gICAgICAgIGR1cmF0aW9uOlx0MCxcbiAgICAgICAgcHVibGlzaGVkQXQ6ICcnLFxuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaChlKSB7XG4gICAgY29uc29sZS5sb2coZSlcbiAgfVxufVxuXG5mdW5jdGlvbiBjbGVhblRpdGxlKHRpdGxlKSB7XG4gIGNvbnN0IGJyYWtldHNSZWdleCA9IC9cXFtbXildKlxcXS9cbiAgbGV0IGZvcmJpZGVuVGVybXMgPSBbJyhmdWxsIGFsYnVtKScsICcob2ZmaWNpYWwgZXApJywgJyhvZmZpY2lhbCB2aWRlbyknLCAnKHJhZGlvIGVkaXQpJyxdXG4gIHRpdGxlID0gdGl0bGUucmVwbGFjZShicmFrZXRzUmVnZXgsICcnKVxuICBmb3JiaWRlblRlcm1zLmZvckVhY2goZm9yYmlkZW5UZXJtID0+IHtcbiAgICB0aXRsZSA9IHRpdGxlLnJlcGxhY2UobmV3IFJlZ0V4cChmb3JiaWRlblRlcm0sICdpZycpLCAnJylcbiAgICB0aXRsZSA9IHRpdGxlLnJlcGxhY2UoJygpJywgJycpXG4gIH0pXG4gIHJldHVybiB0aXRsZVxufVxuIl19