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
module.exports = {
    getVideoDate,
    getChannelDesc,
    searchVideo,
    searchChannel,
    getChannelVideos,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNldHViZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3VzZXR1YmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLGlDQUFpRDtBQUNqRCxpQ0FBZ0M7QUFVaEMsTUFBTSxPQUFPLEdBQXVCLEVBQUMsT0FBTyxFQUFFO1FBQzVDLHVCQUF1QixFQUFFLENBQUM7UUFDMUIsMEJBQTBCLEVBQUUsa0JBQWtCO1FBQzlDLFlBQVksRUFBRSx5SUFBeUk7S0FDeEosRUFBQyxDQUFBO0FBRUYsTUFBTSxXQUFXLEdBQXVCLEVBQUMsT0FBTyxFQUFFO1FBQ2hELFlBQVksRUFBRSxhQUFhO1FBQzNCLHVCQUF1QixFQUFFLENBQUM7UUFDMUIsMEJBQTBCLEVBQUUsa0JBQWtCO0tBQy9DLEVBQUMsQ0FBQTtBQUVGLE1BQU0sVUFBVSxHQUFHLDJEQUEyRCxDQUFBO0FBQzlFLE1BQU0sV0FBVyxHQUFJLHNFQUFzRSxDQUFBO0FBRTNGLFNBQVMsSUFBSSxDQUFDLEVBQUU7SUFDZCxJQUFJLEtBQUssR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2pDLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQztJQUNoQixPQUFNLEdBQUcsR0FBRyxLQUFLLEdBQUcsRUFBRSxFQUFFO1FBQ3RCLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQzdCO0FBQ0YsQ0FBQztBQUVELFNBQWUsWUFBWSxDQUFDLEVBQVU7OztRQUNwQyxJQUFJO1lBQ0YsTUFBTSxJQUFJLEdBQVEsQ0FBQyxNQUFNLGVBQUssQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLEdBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBYyxDQUFBO1lBQ2hHLE1BQU0sR0FBRyxHQUFRLE9BQUEsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsMENBQUksQ0FBQyxNQUFLLElBQUksQ0FBQTtZQUNwRCxNQUFNLEtB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RyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQTtJQUNqQyxDQUFDLENBQUMsQ0FBQTtJQUNGLE9BQU8sS0FBSyxDQUFBO0FBQ2QsQ0FBQztBQTlRRCxpQkFBUztJQUNQLFlBQVk7SUFDWixjQUFjO0lBQ2QsV0FBVztJQUNYLGFBQWE7SUFDYixnQkFBZ0I7Q0FDakIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBheGlvcywgeyBBeGlvc1JlcXVlc3RDb25maWcgfSBmcm9tICdheGlvcydcbmltcG9ydCAqIGFzIG1vbWVudCBmcm9tICdtb21lbnQnXG5cbmV4cG9ydCA9IHtcbiAgZ2V0VmlkZW9EYXRlLFxuICBnZXRDaGFubmVsRGVzYyxcbiAgc2VhcmNoVmlkZW8sXG4gIHNlYXJjaENoYW5uZWwsXG4gIGdldENoYW5uZWxWaWRlb3MsXG59XG5cbmNvbnN0IGhlYWRlcnM6IEF4aW9zUmVxdWVzdENvbmZpZyA9IHtoZWFkZXJzOiB7XG4gICd4LXlvdXR1YmUtY2xpZW50LW5hbWUnOiAxLFxuICAneC15b3V0dWJlLWNsaWVudC12ZXJzaW9uJzogJzIuMjAyMDA5MTEuMDQuMDAnLFxuICAnVXNlci1BZ2VudCc6ICdNb3ppbGxhLzUuMCAoTGludXg7IEFuZHJvaWQgNS4wOyBTTS1HOTAwUCBCdWlsZC9MUlgyMVQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS82Ny4wLjMzOTYuODcgTW9iaWxlIFNhZmFyaS81MzcuMzYnLFxufX1cblxuY29uc3QgaGVhZGVyc0FKQVg6IEF4aW9zUmVxdWVzdENvbmZpZyA9IHtoZWFkZXJzOiB7XG4gICdVc2VyLUFnZW50JzogJ2hlbGxvYmljemVzJyxcbiAgJ3gteW91dHViZS1jbGllbnQtbmFtZSc6IDEsXG4gICd4LXlvdXR1YmUtY2xpZW50LXZlcnNpb24nOiAnMi4yMDIwMDczMS4wMi4wMSdcbn19XG5cbmNvbnN0IHZpZGVvUmVnZXggPSAveXRJbml0aWFsUGxheWVyQ29uZmlnXFwgXFw9XFwgKC4qKVxcO1xcblxcIFxcIFxcIFxcIFxcIFxcIHNldFRpbWVvdXQvXG5jb25zdCBtb2JpbGVSZWdleCAgPSAvaWRcXD1cXFwiaW5pdGlhbFxcLWRhdGFcXFwiXFw+XFw8XFwhXFwtXFwtXFwgKC4qKVxcIFxcLVxcLVxcPlxcPFxcL2RpdlxcPlxcPHNjcmlwdFxcIFxcPmlmL1xuXG5mdW5jdGlvbiB3YWl0KG1zKXtcbiAgdmFyIHN0YXJ0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIHZhciBlbmQgPSBzdGFydDtcbiAgd2hpbGUoZW5kIDwgc3RhcnQgKyBtcykge1xuICAgIGVuZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0VmlkZW9EYXRlKGlkOiBzdHJpbmcpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBib2R5OiBhbnkgPSAoYXdhaXQgYXhpb3MuZ2V0KCdodHRwczovL20ueW91dHViZS5jb20vd2F0Y2g/dj0nK2lkLCBoZWFkZXJzKSkuZGF0YSBhcyBzdHJpbmdcbiAgICBjb25zdCByYXc6IGFueSA9IHZpZGVvUmVnZXguZXhlYyhib2R5KSA/LlsxXSB8fCAne30nXG4gICAgY29uc3QgZGF0YXM6IGFueSA9IEpTT04ucGFyc2UocmF3KVxuICAgIGxldCBwdWJsaXNoVGV4dDogYW55ID0gSlNPTi5wYXJzZShkYXRhcy5hcmdzLnBsYXllcl9yZXNwb25zZSkubWljcm9mb3JtYXQ/LnBsYXllck1pY3JvZm9ybWF0UmVuZGVyZXI/LnB1Ymxpc2hEYXRlXG4gICAgcHVibGlzaFRleHQgKz0gJyAnK01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDI0KSsnLScrTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNjApKyctJytNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA2MClcbiAgICByZXR1cm4gbW9tZW50KHB1Ymxpc2hUZXh0LCAnWVlZWS1NTS1ERCBILW0tcycpLnRvRGF0ZSgpXG4gIH0gY2F0Y2goZSkge1xuICAgIGNvbnNvbGUubG9nKCdnZXQgZGF0ZSBlcnJvciBmb3IgJytpZCsnLCB0cnkgYWdhaW4nLCBlKVxuICAgIGdldFZpZGVvRGF0ZShpZClcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRDaGFubmVsRGVzYyhpZDogc3RyaW5nKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgYm9keTogYW55ID0gKGF3YWl0IGF4aW9zLmdldCgnaHR0cHM6Ly9tLnlvdXR1YmUuY29tL2NoYW5uZWwvJytlbmNvZGVVUkkoaWQpKycvdmlkZW9zJywgaGVhZGVycykpLmRhdGEgYXMgc3RyaW5nXG4gICAgY29uc3QgcmF3OiBhbnkgPSBtb2JpbGVSZWdleC5leGVjKGJvZHkpID8uWzFdIHx8ICd7fSdcbiAgICBjb25zdCBkYXRhOiBhbnkgPSBKU09OLnBhcnNlKHJhdylcbiAgICBsZXQgZGVzY3JpcHRpb246IHN0cmluZyA9IGRhdGEubWV0YWRhdGE/LmNoYW5uZWxNZXRhZGF0YVJlbmRlcmVyPy5kZXNjcmlwdGlvbiB8fCAnJ1xuICAgIHJldHVybiBkZXNjcmlwdGlvblxuICB9IGNhdGNoKGUpIHtcbiAgICBjb25zb2xlLmxvZygnY2hhbm5lbCBkZXNjIGVycm9yIGZvciAnK2lkLCBlKVxuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNlYXJjaFZpZGVvKHRlcm1zOiBzdHJpbmcsIHRva2VuPzogc3RyaW5nKSB7XG4gIHRyeSB7XG4gICAgbGV0IGl0ZW1zOiBhbnkgPSBbXVxuICAgIGxldCB2aWRlb3M6IGFueSA9IFtdXG4gICAgLy8gaW5pdGlhbCB2aWRlb3Mgc2VhcmNoXG4gICAgaWYoIXRva2VuKSB7XG4gICAgICBsZXQgYm9keTogYW55ID0gKGF3YWl0IGF4aW9zLmdldCgnaHR0cHM6Ly9tLnlvdXR1YmUuY29tL3Jlc3VsdHM/c3A9RWdJUUFRJTI1M0QlMjUzRCZ2aWRlb0VtYmVkZGFibGU9dHJ1ZSZzZWFyY2hfcXVlcnk9Jyt0ZXJtcywgaGVhZGVycykpLmRhdGEgYXMgc3RyaW5nXG4gICAgICBsZXQgcmF3OiBhbnkgPSBtb2JpbGVSZWdleC5leGVjKGJvZHkpID8uWzFdIHx8ICd7fSdcbiAgICAgIGxldCBkYXRhczogYW55ID0gSlNPTi5wYXJzZShyYXcpLmNvbnRlbnRzLnNlY3Rpb25MaXN0UmVuZGVyZXJcbiAgICAgIGl0ZW1zID0gZGF0YXMuY29udGVudHNbMF0uaXRlbVNlY3Rpb25SZW5kZXJlci5jb250ZW50c1xuICAgICAgdG9rZW4gPSBkYXRhcy5jb250aW51YXRpb25zPy5bMF0/LnJlbG9hZENvbnRpbnVhdGlvbkRhdGE/LmNvbnRpbnVhdGlvbiB8fCAnJ1xuICAgIH1cbiAgICAvLyBtb3JlIHZpZGVvc1xuICAgIGVsc2Uge1xuICAgICAgbGV0IGRhdGEgPSAoYXdhaXQgYXhpb3MuZ2V0KCdodHRwczovL3lvdXR1YmUuY29tL2Jyb3dzZV9hamF4P2N0b2tlbj0nK3Rva2VuLCBoZWFkZXJzQUpBWCkpLmRhdGFcbiAgICAgIGl0ZW1zID0gZGF0YVsxXS5yZXNwb25zZS5jb250aW51YXRpb25Db250ZW50cz8uZ3JpZENvbnRpbnVhdGlvbj8uaXRlbXMgfHwgJydcbiAgICAgIHRva2VuID0gZGF0YVsxXS5yZXNwb25zZS5jb250aW51YXRpb25Db250ZW50cz8uZ3JpZENvbnRpbnVhdGlvbj8uY29udGludWF0aW9ucz8uWzBdPy5uZXh0Q29udGludWF0aW9uRGF0YT8uY29udGludWF0aW9uIHx8ICcnXG4gICAgfVxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmlkZW9zLnB1c2goYXdhaXQgZm9ybWF0VmlkZW8oaXRlbXNbaV0sIHRydWUpKVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgdHJhY2tzOiB2aWRlb3MsXG4gICAgICB0b2tlbjogdG9rZW4sXG4gICAgfVxuICB9IGNhdGNoKGUpIHtcbiAgICBjb25zb2xlLmxvZygnc2VhcmNoIHZpZGVvcyBlcnJvciwgdGVybXM6ICcrdGVybXMsIGUpXG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gc2VhcmNoQ2hhbm5lbCh0ZXJtczogc3RyaW5nLCB0b2tlbj86IHN0cmluZykge1xuICB0cnkge1xuICAgIGxldCBpdGVtczogYW55ID0gW11cbiAgICBsZXQgY2hhbm5lbHM6IGFueSA9IFtdXG4gICAgaWYoIXRva2VuKSB7XG4gICAgICBjb25zdCBib2R5OiBhbnkgPSAoYXdhaXQgYXhpb3MuZ2V0KCdodHRwczovL20ueW91dHViZS5jb20vcmVzdWx0cz9zcD1DQUFTQWhBQyZzZWFyY2hfcXVlcnk9JytlbmNvZGVVUkkodGVybXMpLCBoZWFkZXJzKSkuZGF0YSBhcyBzdHJpbmdcbiAgICAgIGNvbnN0IHJhdzogYW55ID0gbW9iaWxlUmVnZXguZXhlYyhib2R5KSA/LlsxXSB8fCAne30nXG4gICAgICBjb25zdCBkYXRhOiBhbnkgPSBKU09OLnBhcnNlKHJhdylcbiAgICAgIGl0ZW1zID0gZGF0YS5jb250ZW50cy5zZWN0aW9uTGlzdFJlbmRlcmVyPy5jb250ZW50c1swXT8uaXRlbVNlY3Rpb25SZW5kZXJlcj8uY29udGVudHMgIFxuICAgICAgdG9rZW4gPSBkYXRhLmNvbnRpbnVhdGlvbnM/LlswXT8ucmVsb2FkQ29udGludWF0aW9uRGF0YT8uY29udGludWF0aW9uIHx8ICcnXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbGV0IGRhdGEgPSAoYXdhaXQgYXhpb3MuZ2V0KCdodHRwczovL3lvdXR1YmUuY29tL2Jyb3dzZV9hamF4P2N0b2tlbj0nK3Rva2VuLCBoZWFkZXJzQUpBWCkpLmRhdGFcbiAgICAgIGl0ZW1zID0gZGF0YVsxXS5yZXNwb25zZS5jb250aW51YXRpb25Db250ZW50cz8uZ3JpZENvbnRpbnVhdGlvbj8uaXRlbXMgfHwgJydcbiAgICAgIHRva2VuID0gZGF0YVsxXS5yZXNwb25zZS5jb250aW51YXRpb25Db250ZW50cz8uZ3JpZENvbnRpbnVhdGlvbj8uY29udGludWF0aW9ucz8uWzBdPy5uZXh0Q29udGludWF0aW9uRGF0YT8uY29udGludWF0aW9uIHx8ICcnXG4gICAgfVxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYoaXRlbXNbaV0uY29tcGFjdENoYW5uZWxSZW5kZXJlcikge1xuICAgICAgICBjb25zdCBpdGVtID0gaXRlbXNbaV0uY29tcGFjdENoYW5uZWxSZW5kZXJlclxuICAgICAgICBsZXQgYXZhdGFyU21hbGwgPSBpdGVtLnRodW1ibmFpbD8udGh1bWJuYWlsc1swXS51cmwgfHwgJydcbiAgICAgICAgbGV0IGF2YXRhckJpZyAgID0gaXRlbS50aHVtYm5haWw/LnRodW1ibmFpbHNbMV0udXJsIHx8ICcnXG4gICAgICAgIGF2YXRhclNtYWxsID0gKGF2YXRhclNtYWxsLnN0YXJ0c1dpdGgoJy8vJykgPyAnaHR0cHM6JythdmF0YXJTbWFsbCA6IGF2YXRhclNtYWxsKVxuICAgICAgICBhdmF0YXJCaWcgPSAoYXZhdGFyQmlnLnN0YXJ0c1dpdGgoJy8vJykgPyAnaHR0cHM6JythdmF0YXJCaWcgOiBhdmF0YXJCaWcpXG4gICAgICAgIGNoYW5uZWxzLnB1c2goe1xuICAgICAgICAgIG5hbWU6ICAgICAgICAgICAgICAgICAgaXRlbS50aXRsZS5ydW5zWzBdLnRleHQsXG4gICAgICAgICAgY2hhbm5lbF9pZDogICAgICAgICAgICBpdGVtLmNoYW5uZWxJZCxcbiAgICAgICAgICBuYl92aWRlb3M6ICAgICAgICAgICAgIGl0ZW0udmlkZW9Db3VudFRleHQ/LnJ1bnNbMF0udGV4dC5yZXBsYWNlKC9bXjAtOWtdL2csICcnKS5yZXBsYWNlKCdrJywgJzAwMCcpIHx8IDAsXG4gICAgICAgICAgbmJfc3Vic2NyaWJlcjogICAgICAgICBpdGVtLnN1YnNjcmliZXJDb3VudFRleHQ/LnJ1bnNbMF0udGV4dC5yZXBsYWNlKC9bXjAtOWtdL2csICcnKS5yZXBsYWNlKCdrJywgJzAwMCcpIHx8IDAsXG4gICAgICAgICAgb2ZmaWNpYWw6ICAgICAgICAgICAgICAoaXRlbS5vd25lckJhZGdlcyA/IHRydWUgOiBmYWxzZSksXG4gICAgICAgICAgY2hhbm5lbF9hdmF0YXJfc21hbGw6ICBhdmF0YXJTbWFsbCxcbiAgICAgICAgICBjaGFubmVsX2F2YXRhcl9tZWRpdW06IGF2YXRhckJpZyxcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYoaXRlbXNbaV0uZGlkWW91TWVhblJlbmRlcmVyIHx8IGl0ZW1zW2ldLnNob3dpbmdSZXN1bHRzRm9yUmVuZGVyZXIpIHtcbiAgICAgICAgbGV0IGl0ZW06IGFueVxuICAgICAgICBpZihpdGVtc1tpXS5kaWRZb3VNZWFuUmVuZGVyZXIpIHtcbiAgICAgICAgICBpdGVtID0gaXRlbXNbaV0uZGlkWW91TWVhblJlbmRlcmVyXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgaXRlbSA9IGl0ZW1zW2ldLnNob3dpbmdSZXN1bHRzRm9yUmVuZGVyZXJcbiAgICAgICAgfVxuICAgICAgICBjaGFubmVscy5wdXNoKHtcbiAgICAgICAgICBuYW1lOiAgICAgICAgICAgICAgICAgIGl0ZW0uY29ycmVjdGVkUXVlcnkucnVuc1swXS50ZXh0LFxuICAgICAgICAgIGNoYW5uZWxfaWQ6ICAgICAgICAgICAgJ2RpZHlvdW1lYW4nLFxuICAgICAgICAgIG5iX3ZpZGVvczogICAgICAgICAgICAgJzAnLFxuICAgICAgICAgIG5iX3N1YnNjcmliZXI6ICAgICAgICAgJzAnLFxuICAgICAgICAgIG9mZmljaWFsOiAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgY2hhbm5lbF9hdmF0YXJfc21hbGw6ICAnJyxcbiAgICAgICAgICBjaGFubmVsX2F2YXRhcl9tZWRpdW06ICcnLFxuICAgICAgICB9KVxuICAgICAgICBjaGFubmVsc1tpXVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgY2hhbm5lbHM6IGNoYW5uZWxzLFxuICAgICAgdG9rZW46IHRva2VuLFxuICAgIH1cbiAgfSBjYXRjaChlKSB7XG4gICAgY29uc29sZS5sb2coJ3NlYXJjaCBjaGFubmVsIGVycm9yLCB0ZXJtczogJyt0ZXJtcywgZSlcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRDaGFubmVsVmlkZW9zKGlkOiBzdHJpbmcsIHB1Ymxpc2hlZF9hZnRlcj86IERhdGUpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBib2R5OiBhbnkgPSAoYXdhaXQgYXhpb3MuZ2V0KCdodHRwczovL20ueW91dHViZS5jb20vY2hhbm5lbC8nK2VuY29kZVVSSShpZCkrJy92aWRlb3MnLCBoZWFkZXJzKSkuZGF0YSBhcyBzdHJpbmdcbiAgICBjb25zdCByYXc6IGFueSA9IG1vYmlsZVJlZ2V4LmV4ZWMoYm9keSkgPy5bMV0gfHwgJ3t9J1xuICAgIGNvbnN0IGRhdGE6IGFueSA9IEpTT04ucGFyc2UocmF3KVxuICAgIGNvbnN0IGl0ZW1zOiBhbnkgPSBkYXRhLmNvbnRlbnRzLnNpbmdsZUNvbHVtbkJyb3dzZVJlc3VsdHNSZW5kZXJlcj8udGFic1sxXT8udGFiUmVuZGVyZXI/LmNvbnRlbnQ/LnNlY3Rpb25MaXN0UmVuZGVyZXI/LmNvbnRlbnRzWzBdPy5pdGVtU2VjdGlvblJlbmRlcmVyXG4gICAgbGV0IHRva2VuOiBzdHJpbmcgPSBpdGVtcy5jb250aW51YXRpb25zPy5bMF0/Lm5leHRDb250aW51YXRpb25EYXRhPy5jb250aW51YXRpb24gfHwgJydcbiAgICBsZXQgdmlkZW9zOiBhbnkgPSBbXVxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBpdGVtcy5jb250ZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IHZpZGVvID0gYXdhaXQgZm9ybWF0VmlkZW8oaXRlbXMuY29udGVudHNbaV0pXG4gICAgICBpZighcHVibGlzaGVkX2FmdGVyKSB7XG4gICAgICAgIHZpZGVvcy5wdXNoKHZpZGVvKVxuICAgICAgfVxuICAgICAgZWxzZSBpZihtb21lbnQodmlkZW8ucHVibGlzaGVkQXQpLmlzQWZ0ZXIocHVibGlzaGVkX2FmdGVyKSAmJiBwdWJsaXNoZWRfYWZ0ZXIpIHtcbiAgICAgICAgdmlkZW9zLnB1c2godmlkZW8pXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHZpZGVvc1xuICAgICAgfVxuICAgIH1cbiAgICB3aGlsZSh0b2tlbiAhPT0gJycpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHdhaXQoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNTAwKSlcbiAgICAgICAgbGV0IGRhdGEgPSAoYXdhaXQgYXhpb3MuZ2V0KCdodHRwczovL3lvdXR1YmUuY29tL2Jyb3dzZV9hamF4P2N0b2tlbj0nK3Rva2VuLCBoZWFkZXJzQUpBWCkpLmRhdGFcbiAgICAgICAgbGV0IG5ld1ZpZGVvczogYW55ID0gZGF0YVsxXT8ucmVzcG9uc2U/LmNvbnRpbnVhdGlvbkNvbnRlbnRzPy5ncmlkQ29udGludWF0aW9uPy5pdGVtcyB8fCAnJ1xuICAgICAgICB0b2tlbiA9IGRhdGFbMV0ucmVzcG9uc2UuY29udGludWF0aW9uQ29udGVudHM/LmdyaWRDb250aW51YXRpb24/LmNvbnRpbnVhdGlvbnM/LlswXT8ubmV4dENvbnRpbnVhdGlvbkRhdGE/LmNvbnRpbnVhdGlvbiB8fCAnJ1xuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgbmV3VmlkZW9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgbGV0IHZpZGVvID0gYXdhaXQgZm9ybWF0VmlkZW8obmV3VmlkZW9zW2ldKVxuICAgICAgICAgIGlmKG1vbWVudCh2aWRlby5wdWJsaXNoZWRBdCkuaXNCZWZvcmUocHVibGlzaGVkX2FmdGVyKSAmJiBwdWJsaXNoZWRfYWZ0ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB2aWRlb3NcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2aWRlb3MucHVzaCh2aWRlbylcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhlKVxuICAgICAgICB0b2tlbiA9ICcnXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2aWRlb3NcbiAgfSBjYXRjaChlKSB7XG4gICAgY29uc29sZS5sb2coJ2NoYW5uZWwgdmlkZW9zIGVycm9yIGZvciBpZDogJytpZCwgZSlcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBmb3JtYXRWaWRlbyh2aWRlbzogYW55LCBzcGVlZERhdGU/OiBib29sZWFuKSB7XG4gIHRyeXtcbiAgICBpZih2aWRlby5jb21wYWN0VmlkZW9SZW5kZXJlciB8fCB2aWRlby5ncmlkVmlkZW9SZW5kZXJlcikge1xuICAgICAgdmlkZW8gPSB2aWRlby5jb21wYWN0VmlkZW9SZW5kZXJlciA/IHZpZGVvLmNvbXBhY3RWaWRlb1JlbmRlcmVyIDogdmlkZW8uZ3JpZFZpZGVvUmVuZGVyZXJcbiAgICAgIGxldCBpZDogc3RyaW5nID0gdmlkZW8udmlkZW9JZFxuICAgICAgbGV0IGR1cmF0aW9uRGF0YXM6IGFueSA9IDBcbiAgICAgIC8vIGdldCB0aXRsZVxuICAgICAgaWYodmlkZW8udGl0bGUuc2ltcGxlVGV4dCkge1xuICAgICAgICB2aWRlby50aXRsZSA9IHZpZGVvLnRpdGxlLnNpbXBsZVRleHRcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYodmlkZW8udGl0bGUucnVuc1swXS50ZXh0KSB7XG4gICAgICAgIHZpZGVvLnRpdGxlID0gdmlkZW8udGl0bGUucnVuc1swXS50ZXh0XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdmlkZW8udGl0bGUgPSAnJ1xuICAgICAgfVxuICAgICAgLy8gdGl0bGUgZm9ybWF0aW5nXG4gICAgICB2aWRlby5vcmlnaW5hbF90aXRsZSA9IHZpZGVvLnRpdGxlXG4gICAgICB2aWRlby50aXRsZSA9IGNsZWFuVGl0bGUodmlkZW8udGl0bGUpXG5cbiAgICAgIGlmKHZpZGVvLnRpdGxlLnNwbGl0KCctJykubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHZpZGVvLmFydGlzdCA9ICcnXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgbGV0IHNwbGl0ZWQgPSB2aWRlby5vcmlnaW5hbF90aXRsZS5tYXRjaCgvKFteLF0qKS0oLiopLylcbiAgICAgICAgdmlkZW8uYXJ0aXN0ID0gc3BsaXRlZFsxXVxuICAgICAgICB2aWRlby50aXRsZSA9IHNwbGl0ZWRbMl1cbiAgICAgIH1cbiAgICAgIC8vIGR1cmF0aW9uIGZvcm1hdGluZ1xuICAgICAgaWYodmlkZW8ubGVuZ3RoVGV4dCkge1xuICAgICAgICBkdXJhdGlvbkRhdGFzID0gdmlkZW8ubGVuZ3RoVGV4dC5ydW5zWzBdLnRleHQuc3BsaXQoJzonKVxuICAgICAgfVxuICAgICAgZWxzZSBpZih2aWRlby50aHVtYm5haWxPdmVybGF5c1swXT8udGh1bWJuYWlsT3ZlcmxheVRpbWVTdGF0dXNSZW5kZXJlcj8udGV4dC5zaW1wbGVUZXh0KSB7XG4gICAgICAgIGR1cmF0aW9uRGF0YXMgPSB2aWRlby50aHVtYm5haWxPdmVybGF5c1swXT8udGh1bWJuYWlsT3ZlcmxheVRpbWVTdGF0dXNSZW5kZXJlcj8udGV4dC5zaW1wbGVUZXh0LnNwbGl0KCc6JykgIHx8ICcnXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZHVyYXRpb25EYXRhcyA9IFswLDBdXG4gICAgICB9XG4gICAgICBsZXQgbWludXRlczogbnVtYmVyID0gcGFyc2VJbnQoZHVyYXRpb25EYXRhc1swXSkgKiA2MFxuICAgICAgbGV0IHNlY29uZHM6IG51bWJlciA9IHBhcnNlSW50KGR1cmF0aW9uRGF0YXNbMV0pXG4gICAgICAvLyBEYXRlIGZvcm1hdGluZ1xuICAgICAgbGV0IHB1Ymxpc2hlZEF0ID0gIXNwZWVkRGF0ZSA/IGF3YWl0IGdldFZpZGVvRGF0ZShpZCkgOiB2aWRlby5wdWJsaXNoZWRUaW1lVGV4dD8ucnVuc1swXS50ZXh0IHx8ICcnXG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogIGlkLFxuICAgICAgICBvcmlnaW5hbF90aXRsZTogdmlkZW8ub3JpZ2luYWxfdGl0bGUsXG4gICAgICAgIHRpdGxlOlx0dmlkZW8udGl0bGUsXG4gICAgICAgIGFydGlzdDogdmlkZW8uYXJ0aXN0LFxuICAgICAgICBkdXJhdGlvbjpcdG1pbnV0ZXMrc2Vjb25kcyxcbiAgICAgICAgcHVibGlzaGVkQXQ6IHB1Ymxpc2hlZEF0LFxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmKHZpZGVvLmRpZFlvdU1lYW5SZW5kZXJlciB8fCB2aWRlby5zaG93aW5nUmVzdWx0c0ZvclJlbmRlcmVyKSB7XG4gICAgICB2aWRlbyA9IHZpZGVvLmRpZFlvdU1lYW5SZW5kZXJlciA/IHZpZGVvLmRpZFlvdU1lYW5SZW5kZXJlciA6IHZpZGVvLnNob3dpbmdSZXN1bHRzRm9yUmVuZGVyZXJcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkOiAgJ2RpZHlvdW1lYW4nLFxuICAgICAgICB0aXRsZTpcdHZpZGVvLmNvcnJlY3RlZFF1ZXJ5LnJ1bnNbMF0udGV4dCxcbiAgICAgICAgYXJ0aXN0OiAnJyxcbiAgICAgICAgZHVyYXRpb246XHQwLFxuICAgICAgICBwdWJsaXNoZWRBdDogJycsXG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoKGUpIHtcbiAgICBjb25zb2xlLmxvZyhlKVxuICB9XG59XG5cbmZ1bmN0aW9uIGNsZWFuVGl0bGUodGl0bGUpIHtcbiAgY29uc3QgYnJha2V0c1JlZ2V4ID0gL1xcW1teKV0qXFxdL1xuICBsZXQgZm9yYmlkZW5UZXJtcyA9IFsnKGZ1bGwgYWxidW0pJywgJyhvZmZpY2lhbCBlcCknLCAnKG9mZmljaWFsIHZpZGVvKScsICcocmFkaW8gZWRpdCknLF1cbiAgdGl0bGUgPSB0aXRsZS5yZXBsYWNlKGJyYWtldHNSZWdleCwgJycpXG4gIGZvcmJpZGVuVGVybXMuZm9yRWFjaChmb3JiaWRlblRlcm0gPT4ge1xuICAgIHRpdGxlID0gdGl0bGUucmVwbGFjZShuZXcgUmVnRXhwKGZvcmJpZGVuVGVybSwgJ2lnJyksICcnKVxuICAgIHRpdGxlID0gdGl0bGUucmVwbGFjZSgnKCknLCAnJylcbiAgfSlcbiAgcmV0dXJuIHRpdGxlXG59XG4iXX0=