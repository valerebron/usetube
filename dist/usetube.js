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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNldHViZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3VzZXR1YmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLGlDQUFpRDtBQUNqRCxpQ0FBZ0M7QUFVaEMsTUFBTSxPQUFPLEdBQXVCLEVBQUMsT0FBTyxFQUFFO1FBQzVDLDZCQUE2QixFQUFHLEdBQUc7UUFDbkMsdUJBQXVCLEVBQUUsQ0FBQztRQUMxQiwwQkFBMEIsRUFBRSxrQkFBa0I7UUFDOUMsWUFBWSxFQUFFLHlJQUF5STtLQUN4SixFQUFDLENBQUE7QUFFRixNQUFNLFdBQVcsR0FBdUIsRUFBQyxPQUFPLEVBQUU7UUFDaEQsNkJBQTZCLEVBQUcsR0FBRztRQUNuQyxZQUFZLEVBQUUsYUFBYTtRQUMzQix1QkFBdUIsRUFBRSxDQUFDO1FBQzFCLDBCQUEwQixFQUFFLGtCQUFrQjtLQUMvQyxFQUFDLENBQUE7QUFFRixNQUFNLFVBQVUsR0FBRywyREFBMkQsQ0FBQTtBQUM5RSxNQUFNLFdBQVcsR0FBSSxzRUFBc0UsQ0FBQTtBQUUzRixTQUFTLElBQUksQ0FBQyxFQUFFO0lBQ2QsSUFBSSxLQUFLLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNqQyxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUM7SUFDaEIsT0FBTSxHQUFHLEdBQUcsS0FBSyxHQUFHLEVBQUUsRUFBRTtRQUN0QixHQUFHLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUM3QjtBQUNGLENBQUM7QUFFRCxTQUFlLFlBQVksQ0FBQyxFQUFVOzs7UUFDcEMsSUFBSTtZQUNGLE1BQU0sSUFBSSxHQUFRLENBQUMsTUFBTSxlQUFLLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxHQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQWMsQ0FBQTtZQUNoRyxNQUFNLEdBQUcsR0FBUSxPQUFBLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFB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RSxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUN6RCxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUE7SUFDakMsQ0FBQyxDQUFDLENBQUE7SUFDRixPQUFPLEtBQUssQ0FBQTtBQUNkLENBQUM7QUFoUkQsaUJBQVM7SUFDUCxZQUFZO0lBQ1osY0FBYztJQUNkLFdBQVc7SUFDWCxhQUFhO0lBQ2IsZ0JBQWdCO0NBQ2pCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXhpb3MsIHsgQXhpb3NSZXF1ZXN0Q29uZmlnIH0gZnJvbSAnYXhpb3MnXG5pbXBvcnQgKiBhcyBtb21lbnQgZnJvbSAnbW9tZW50J1xuXG5leHBvcnQgPSB7XG4gIGdldFZpZGVvRGF0ZSxcbiAgZ2V0Q2hhbm5lbERlc2MsXG4gIHNlYXJjaFZpZGVvLFxuICBzZWFyY2hDaGFubmVsLFxuICBnZXRDaGFubmVsVmlkZW9zLFxufVxuXG5jb25zdCBoZWFkZXJzOiBBeGlvc1JlcXVlc3RDb25maWcgPSB7aGVhZGVyczoge1xuICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJyA6ICcqJyxcbiAgJ3gteW91dHViZS1jbGllbnQtbmFtZSc6IDEsXG4gICd4LXlvdXR1YmUtY2xpZW50LXZlcnNpb24nOiAnMi4yMDIwMDkxMS4wNC4wMCcsXG4gICdVc2VyLUFnZW50JzogJ01vemlsbGEvNS4wIChMaW51eDsgQW5kcm9pZCA1LjA7IFNNLUc5MDBQIEJ1aWxkL0xSWDIxVCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzY3LjAuMzM5Ni44NyBNb2JpbGUgU2FmYXJpLzUzNy4zNicsXG59fVxuXG5jb25zdCBoZWFkZXJzQUpBWDogQXhpb3NSZXF1ZXN0Q29uZmlnID0ge2hlYWRlcnM6IHtcbiAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbicgOiAnKicsXG4gICdVc2VyLUFnZW50JzogJ2hlbGxvYmljemVzJyxcbiAgJ3gteW91dHViZS1jbGllbnQtbmFtZSc6IDEsXG4gICd4LXlvdXR1YmUtY2xpZW50LXZlcnNpb24nOiAnMi4yMDIwMDczMS4wMi4wMSdcbn19XG5cbmNvbnN0IHZpZGVvUmVnZXggPSAveXRJbml0aWFsUGxheWVyQ29uZmlnXFwgXFw9XFwgKC4qKVxcO1xcblxcIFxcIFxcIFxcIFxcIFxcIHNldFRpbWVvdXQvXG5jb25zdCBtb2JpbGVSZWdleCAgPSAvaWRcXD1cXFwiaW5pdGlhbFxcLWRhdGFcXFwiXFw+XFw8XFwhXFwtXFwtXFwgKC4qKVxcIFxcLVxcLVxcPlxcPFxcL2RpdlxcPlxcPHNjcmlwdFxcIFxcPmlmL1xuXG5mdW5jdGlvbiB3YWl0KG1zKXtcbiAgdmFyIHN0YXJ0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIHZhciBlbmQgPSBzdGFydDtcbiAgd2hpbGUoZW5kIDwgc3RhcnQgKyBtcykge1xuICAgIGVuZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0VmlkZW9EYXRlKGlkOiBzdHJpbmcpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBib2R5OiBhbnkgPSAoYXdhaXQgYXhpb3MuZ2V0KCdodHRwczovL20ueW91dHViZS5jb20vd2F0Y2g/dj0nK2lkLCBoZWFkZXJzKSkuZGF0YSBhcyBzdHJpbmdcbiAgICBjb25zdCByYXc6IGFueSA9IHZpZGVvUmVnZXguZXhlYyhib2R5KSA/LlsxXSB8fCAne30nXG4gICAgY29uc3QgZGF0YXM6IGFueSA9IEpTT04ucGFyc2UocmF3KVxuICAgIGxldCBwdWJsaXNoVGV4dDogYW55ID0gSlNPTi5wYXJzZShkYXRhcy5hcmdzLnBsYXllcl9yZXNwb25zZSkubWljcm9mb3JtYXQ/LnBsYXllck1pY3JvZm9ybWF0UmVuZGVyZXI/LnB1Ymxpc2hEYXRlXG4gICAgcHVibGlzaFRleHQgKz0gJyAnK01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDI0KSsnLScrTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNjApKyctJytNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA2MClcbiAgICByZXR1cm4gbW9tZW50KHB1Ymxpc2hUZXh0LCAnWVlZWS1NTS1ERCBILW0tcycpLnRvRGF0ZSgpXG4gIH0gY2F0Y2goZSkge1xuICAgIGNvbnNvbGUubG9nKCdnZXQgZGF0ZSBlcnJvciBmb3IgJytpZCsnLCB0cnkgYWdhaW4nLCBlKVxuICAgIGdldFZpZGVvRGF0ZShpZClcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRDaGFubmVsRGVzYyhpZDogc3RyaW5nKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgYm9keTogYW55ID0gKGF3YWl0IGF4aW9zLmdldCgnaHR0cHM6Ly9tLnlvdXR1YmUuY29tL2NoYW5uZWwvJytlbmNvZGVVUkkoaWQpKycvdmlkZW9zJywgaGVhZGVycykpLmRhdGEgYXMgc3RyaW5nXG4gICAgY29uc3QgcmF3OiBhbnkgPSBtb2JpbGVSZWdleC5leGVjKGJvZHkpID8uWzFdIHx8ICd7fSdcbiAgICBjb25zdCBkYXRhOiBhbnkgPSBKU09OLnBhcnNlKHJhdylcbiAgICBsZXQgZGVzY3JpcHRpb246IHN0cmluZyA9IGRhdGEubWV0YWRhdGE/LmNoYW5uZWxNZXRhZGF0YVJlbmRlcmVyPy5kZXNjcmlwdGlvbiB8fCAnJ1xuICAgIHJldHVybiBkZXNjcmlwdGlvblxuICB9IGNhdGNoKGUpIHtcbiAgICBjb25zb2xlLmxvZygnY2hhbm5lbCBkZXNjIGVycm9yIGZvciAnK2lkLCBlKVxuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNlYXJjaFZpZGVvKHRlcm1zOiBzdHJpbmcsIHRva2VuPzogc3RyaW5nKSB7XG4gIHRyeSB7XG4gICAgbGV0IGl0ZW1zOiBhbnkgPSBbXVxuICAgIGxldCB2aWRlb3M6IGFueSA9IFtdXG4gICAgLy8gaW5pdGlhbCB2aWRlb3Mgc2VhcmNoXG4gICAgaWYoIXRva2VuKSB7XG4gICAgICBsZXQgYm9keTogYW55ID0gKGF3YWl0IGF4aW9zLmdldCgnaHR0cHM6Ly9tLnlvdXR1YmUuY29tL3Jlc3VsdHM/c3A9RWdJUUFRJTI1M0QlMjUzRCZ2aWRlb0VtYmVkZGFibGU9dHJ1ZSZzZWFyY2hfcXVlcnk9Jyt0ZXJtcywgaGVhZGVycykpLmRhdGEgYXMgc3RyaW5nXG4gICAgICBsZXQgcmF3OiBhbnkgPSBtb2JpbGVSZWdleC5leGVjKGJvZHkpID8uWzFdIHx8ICd7fSdcbiAgICAgIGxldCBkYXRhczogYW55ID0gSlNPTi5wYXJzZShyYXcpLmNvbnRlbnRzLnNlY3Rpb25MaXN0UmVuZGVyZXJcbiAgICAgIGl0ZW1zID0gZGF0YXMuY29udGVudHNbMF0uaXRlbVNlY3Rpb25SZW5kZXJlci5jb250ZW50c1xuICAgICAgdG9rZW4gPSBkYXRhcy5jb250aW51YXRpb25zPy5bMF0/LnJlbG9hZENvbnRpbnVhdGlvbkRhdGE/LmNvbnRpbnVhdGlvbiB8fCAnJ1xuICAgIH1cbiAgICAvLyBtb3JlIHZpZGVvc1xuICAgIGVsc2Uge1xuICAgICAgbGV0IGRhdGEgPSAoYXdhaXQgYXhpb3MuZ2V0KCdodHRwczovL3lvdXR1YmUuY29tL2Jyb3dzZV9hamF4P2N0b2tlbj0nK3Rva2VuLCBoZWFkZXJzQUpBWCkpLmRhdGFcbiAgICAgIGl0ZW1zID0gZGF0YVsxXS5yZXNwb25zZS5jb250aW51YXRpb25Db250ZW50cz8uZ3JpZENvbnRpbnVhdGlvbj8uaXRlbXMgfHwgJydcbiAgICAgIHRva2VuID0gZGF0YVsxXS5yZXNwb25zZS5jb250aW51YXRpb25Db250ZW50cz8uZ3JpZENvbnRpbnVhdGlvbj8uY29udGludWF0aW9ucz8uWzBdPy5uZXh0Q29udGludWF0aW9uRGF0YT8uY29udGludWF0aW9uIHx8ICcnXG4gICAgfVxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmlkZW9zLnB1c2goYXdhaXQgZm9ybWF0VmlkZW8oaXRlbXNbaV0sIHRydWUpKVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgdHJhY2tzOiB2aWRlb3MsXG4gICAgICB0b2tlbjogdG9rZW4sXG4gICAgfVxuICB9IGNhdGNoKGUpIHtcbiAgICBjb25zb2xlLmxvZygnc2VhcmNoIHZpZGVvcyBlcnJvciwgdGVybXM6ICcrdGVybXMsIGUpXG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gc2VhcmNoQ2hhbm5lbCh0ZXJtczogc3RyaW5nLCB0b2tlbj86IHN0cmluZykge1xuICB0cnkge1xuICAgIGxldCBpdGVtczogYW55ID0gW11cbiAgICBsZXQgY2hhbm5lbHM6IGFueSA9IFtdXG4gICAgaWYoIXRva2VuKSB7XG4gICAgICBjb25zdCBib2R5OiBhbnkgPSAoYXdhaXQgYXhpb3MuZ2V0KCdodHRwczovL20ueW91dHViZS5jb20vcmVzdWx0cz9zcD1DQUFTQWhBQyZzZWFyY2hfcXVlcnk9JytlbmNvZGVVUkkodGVybXMpLCBoZWFkZXJzKSkuZGF0YSBhcyBzdHJpbmdcbiAgICAgIGNvbnN0IHJhdzogYW55ID0gbW9iaWxlUmVnZXguZXhlYyhib2R5KSA/LlsxXSB8fCAne30nXG4gICAgICBjb25zdCBkYXRhOiBhbnkgPSBKU09OLnBhcnNlKHJhdylcbiAgICAgIGl0ZW1zID0gZGF0YS5jb250ZW50cy5zZWN0aW9uTGlzdFJlbmRlcmVyPy5jb250ZW50c1swXT8uaXRlbVNlY3Rpb25SZW5kZXJlcj8uY29udGVudHMgIFxuICAgICAgdG9rZW4gPSBkYXRhLmNvbnRpbnVhdGlvbnM/LlswXT8ucmVsb2FkQ29udGludWF0aW9uRGF0YT8uY29udGludWF0aW9uIHx8ICcnXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbGV0IGRhdGEgPSAoYXdhaXQgYXhpb3MuZ2V0KCdodHRwczovL3lvdXR1YmUuY29tL2Jyb3dzZV9hamF4P2N0b2tlbj0nK3Rva2VuLCBoZWFkZXJzQUpBWCkpLmRhdGFcbiAgICAgIGl0ZW1zID0gZGF0YVsxXS5yZXNwb25zZS5jb250aW51YXRpb25Db250ZW50cz8uZ3JpZENvbnRpbnVhdGlvbj8uaXRlbXMgfHwgJydcbiAgICAgIHRva2VuID0gZGF0YVsxXS5yZXNwb25zZS5jb250aW51YXRpb25Db250ZW50cz8uZ3JpZENvbnRpbnVhdGlvbj8uY29udGludWF0aW9ucz8uWzBdPy5uZXh0Q29udGludWF0aW9uRGF0YT8uY29udGludWF0aW9uIHx8ICcnXG4gICAgfVxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYoaXRlbXNbaV0uY29tcGFjdENoYW5uZWxSZW5kZXJlcikge1xuICAgICAgICBjb25zdCBpdGVtID0gaXRlbXNbaV0uY29tcGFjdENoYW5uZWxSZW5kZXJlclxuICAgICAgICBsZXQgYXZhdGFyU21hbGwgPSBpdGVtLnRodW1ibmFpbD8udGh1bWJuYWlsc1swXS51cmwgfHwgJydcbiAgICAgICAgbGV0IGF2YXRhckJpZyAgID0gaXRlbS50aHVtYm5haWw/LnRodW1ibmFpbHNbMV0udXJsIHx8ICcnXG4gICAgICAgIGF2YXRhclNtYWxsID0gKGF2YXRhclNtYWxsLnN0YXJ0c1dpdGgoJy8vJykgPyAnaHR0cHM6JythdmF0YXJTbWFsbCA6IGF2YXRhclNtYWxsKVxuICAgICAgICBhdmF0YXJCaWcgPSAoYXZhdGFyQmlnLnN0YXJ0c1dpdGgoJy8vJykgPyAnaHR0cHM6JythdmF0YXJCaWcgOiBhdmF0YXJCaWcpXG4gICAgICAgIGNoYW5uZWxzLnB1c2goe1xuICAgICAgICAgIG5hbWU6ICAgICAgICAgICAgICAgICAgaXRlbS50aXRsZS5ydW5zWzBdLnRleHQsXG4gICAgICAgICAgY2hhbm5lbF9pZDogICAgICAgICAgICBpdGVtLmNoYW5uZWxJZCxcbiAgICAgICAgICBuYl92aWRlb3M6ICAgICAgICAgICAgIGl0ZW0udmlkZW9Db3VudFRleHQ/LnJ1bnNbMF0udGV4dC5yZXBsYWNlKC9bXjAtOWtdL2csICcnKS5yZXBsYWNlKCdrJywgJzAwMCcpIHx8IDAsXG4gICAgICAgICAgbmJfc3Vic2NyaWJlcjogICAgICAgICBpdGVtLnN1YnNjcmliZXJDb3VudFRleHQ/LnJ1bnNbMF0udGV4dC5yZXBsYWNlKC9bXjAtOWtdL2csICcnKS5yZXBsYWNlKCdrJywgJzAwMCcpIHx8IDAsXG4gICAgICAgICAgb2ZmaWNpYWw6ICAgICAgICAgICAgICAoaXRlbS5vd25lckJhZGdlcyA/IHRydWUgOiBmYWxzZSksXG4gICAgICAgICAgY2hhbm5lbF9hdmF0YXJfc21hbGw6ICBhdmF0YXJTbWFsbCxcbiAgICAgICAgICBjaGFubmVsX2F2YXRhcl9tZWRpdW06IGF2YXRhckJpZyxcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYoaXRlbXNbaV0uZGlkWW91TWVhblJlbmRlcmVyIHx8IGl0ZW1zW2ldLnNob3dpbmdSZXN1bHRzRm9yUmVuZGVyZXIpIHtcbiAgICAgICAgbGV0IGl0ZW06IGFueVxuICAgICAgICBpZihpdGVtc1tpXS5kaWRZb3VNZWFuUmVuZGVyZXIpIHtcbiAgICAgICAgICBpdGVtID0gaXRlbXNbaV0uZGlkWW91TWVhblJlbmRlcmVyXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgaXRlbSA9IGl0ZW1zW2ldLnNob3dpbmdSZXN1bHRzRm9yUmVuZGVyZXJcbiAgICAgICAgfVxuICAgICAgICBjaGFubmVscy5wdXNoKHtcbiAgICAgICAgICBuYW1lOiAgICAgICAgICAgICAgICAgIGl0ZW0uY29ycmVjdGVkUXVlcnkucnVuc1swXS50ZXh0LFxuICAgICAgICAgIGNoYW5uZWxfaWQ6ICAgICAgICAgICAgJ2RpZHlvdW1lYW4nLFxuICAgICAgICAgIG5iX3ZpZGVvczogICAgICAgICAgICAgJzAnLFxuICAgICAgICAgIG5iX3N1YnNjcmliZXI6ICAgICAgICAgJzAnLFxuICAgICAgICAgIG9mZmljaWFsOiAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgY2hhbm5lbF9hdmF0YXJfc21hbGw6ICAnJyxcbiAgICAgICAgICBjaGFubmVsX2F2YXRhcl9tZWRpdW06ICcnLFxuICAgICAgICB9KVxuICAgICAgICBjaGFubmVsc1tpXVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgY2hhbm5lbHM6IGNoYW5uZWxzLFxuICAgICAgdG9rZW46IHRva2VuLFxuICAgIH1cbiAgfSBjYXRjaChlKSB7XG4gICAgY29uc29sZS5sb2coJ3NlYXJjaCBjaGFubmVsIGVycm9yLCB0ZXJtczogJyt0ZXJtcywgZSlcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRDaGFubmVsVmlkZW9zKGlkOiBzdHJpbmcsIHB1Ymxpc2hlZF9hZnRlcj86IERhdGUpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBib2R5OiBhbnkgPSAoYXdhaXQgYXhpb3MuZ2V0KCdodHRwczovL20ueW91dHViZS5jb20vY2hhbm5lbC8nK2VuY29kZVVSSShpZCkrJy92aWRlb3MnLCBoZWFkZXJzKSkuZGF0YSBhcyBzdHJpbmdcbiAgICBjb25zdCByYXc6IGFueSA9IG1vYmlsZVJlZ2V4LmV4ZWMoYm9keSkgPy5bMV0gfHwgJ3t9J1xuICAgIGNvbnN0IGRhdGE6IGFueSA9IEpTT04ucGFyc2UocmF3KVxuICAgIGNvbnN0IGl0ZW1zOiBhbnkgPSBkYXRhLmNvbnRlbnRzLnNpbmdsZUNvbHVtbkJyb3dzZVJlc3VsdHNSZW5kZXJlcj8udGFic1sxXT8udGFiUmVuZGVyZXI/LmNvbnRlbnQ/LnNlY3Rpb25MaXN0UmVuZGVyZXI/LmNvbnRlbnRzWzBdPy5pdGVtU2VjdGlvblJlbmRlcmVyXG4gICAgbGV0IHRva2VuOiBzdHJpbmcgPSBpdGVtcy5jb250aW51YXRpb25zPy5bMF0/Lm5leHRDb250aW51YXRpb25EYXRhPy5jb250aW51YXRpb24gfHwgJydcbiAgICBsZXQgdmlkZW9zOiBhbnkgPSBbXVxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBpdGVtcy5jb250ZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IHZpZGVvID0gYXdhaXQgZm9ybWF0VmlkZW8oaXRlbXMuY29udGVudHNbaV0pXG4gICAgICBpZighcHVibGlzaGVkX2FmdGVyKSB7XG4gICAgICAgIHZpZGVvcy5wdXNoKHZpZGVvKVxuICAgICAgfVxuICAgICAgZWxzZSBpZihtb21lbnQodmlkZW8ucHVibGlzaGVkQXQpLmlzQWZ0ZXIocHVibGlzaGVkX2FmdGVyKSAmJiBwdWJsaXNoZWRfYWZ0ZXIpIHtcbiAgICAgICAgdmlkZW9zLnB1c2godmlkZW8pXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHZpZGVvc1xuICAgICAgfVxuICAgIH1cbiAgICB3aGlsZSh0b2tlbiAhPT0gJycpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHdhaXQoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNTAwKSlcbiAgICAgICAgbGV0IGRhdGEgPSAoYXdhaXQgYXhpb3MuZ2V0KCdodHRwczovL3lvdXR1YmUuY29tL2Jyb3dzZV9hamF4P2N0b2tlbj0nK3Rva2VuLCBoZWFkZXJzQUpBWCkpLmRhdGFcbiAgICAgICAgbGV0IG5ld1ZpZGVvczogYW55ID0gZGF0YVsxXT8ucmVzcG9uc2U/LmNvbnRpbnVhdGlvbkNvbnRlbnRzPy5ncmlkQ29udGludWF0aW9uPy5pdGVtcyB8fCAnJ1xuICAgICAgICB0b2tlbiA9IGRhdGFbMV0ucmVzcG9uc2UuY29udGludWF0aW9uQ29udGVudHM/LmdyaWRDb250aW51YXRpb24/LmNvbnRpbnVhdGlvbnM/LlswXT8ubmV4dENvbnRpbnVhdGlvbkRhdGE/LmNvbnRpbnVhdGlvbiB8fCAnJ1xuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgbmV3VmlkZW9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgbGV0IHZpZGVvID0gYXdhaXQgZm9ybWF0VmlkZW8obmV3VmlkZW9zW2ldKVxuICAgICAgICAgIGlmKG1vbWVudCh2aWRlby5wdWJsaXNoZWRBdCkuaXNCZWZvcmUocHVibGlzaGVkX2FmdGVyKSAmJiBwdWJsaXNoZWRfYWZ0ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB2aWRlb3NcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2aWRlb3MucHVzaCh2aWRlbylcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhlKVxuICAgICAgICB0b2tlbiA9ICcnXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2aWRlb3NcbiAgfSBjYXRjaChlKSB7XG4gICAgY29uc29sZS5sb2coJ2NoYW5uZWwgdmlkZW9zIGVycm9yIGZvciBpZDogJytpZCwgZSlcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBmb3JtYXRWaWRlbyh2aWRlbzogYW55LCBzcGVlZERhdGU/OiBib29sZWFuKSB7XG4gIHRyeXtcbiAgICBpZih2aWRlby5jb21wYWN0VmlkZW9SZW5kZXJlciB8fCB2aWRlby5ncmlkVmlkZW9SZW5kZXJlcikge1xuICAgICAgdmlkZW8gPSB2aWRlby5jb21wYWN0VmlkZW9SZW5kZXJlciA/IHZpZGVvLmNvbXBhY3RWaWRlb1JlbmRlcmVyIDogdmlkZW8uZ3JpZFZpZGVvUmVuZGVyZXJcbiAgICAgIGxldCBpZDogc3RyaW5nID0gdmlkZW8udmlkZW9JZFxuICAgICAgbGV0IGR1cmF0aW9uRGF0YXM6IGFueSA9IDBcbiAgICAgIC8vIGdldCB0aXRsZVxuICAgICAgaWYodmlkZW8udGl0bGUuc2ltcGxlVGV4dCkge1xuICAgICAgICB2aWRlby50aXRsZSA9IHZpZGVvLnRpdGxlLnNpbXBsZVRleHRcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYodmlkZW8udGl0bGUucnVuc1swXS50ZXh0KSB7XG4gICAgICAgIHZpZGVvLnRpdGxlID0gdmlkZW8udGl0bGUucnVuc1swXS50ZXh0XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdmlkZW8udGl0bGUgPSAnJ1xuICAgICAgfVxuICAgICAgLy8gdGl0bGUgZm9ybWF0aW5nXG4gICAgICB2aWRlby5vcmlnaW5hbF90aXRsZSA9IHZpZGVvLnRpdGxlXG4gICAgICB2aWRlby50aXRsZSA9IGNsZWFuVGl0bGUodmlkZW8udGl0bGUpXG5cbiAgICAgIGlmKHZpZGVvLnRpdGxlLnNwbGl0KCctJykubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHZpZGVvLmFydGlzdCA9ICcnXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgbGV0IHNwbGl0ZWQgPSB2aWRlby5vcmlnaW5hbF90aXRsZS5tYXRjaCgvKFteLF0qKS0oLiopLylcbiAgICAgICAgdmlkZW8uYXJ0aXN0ID0gc3BsaXRlZFsxXVxuICAgICAgICB2aWRlby50aXRsZSA9IHNwbGl0ZWRbMl1cbiAgICAgIH1cbiAgICAgIC8vIGR1cmF0aW9uIGZvcm1hdGluZ1xuICAgICAgaWYodmlkZW8ubGVuZ3RoVGV4dCkge1xuICAgICAgICBkdXJhdGlvbkRhdGFzID0gdmlkZW8ubGVuZ3RoVGV4dC5ydW5zWzBdLnRleHQuc3BsaXQoJzonKVxuICAgICAgfVxuICAgICAgZWxzZSBpZih2aWRlby50aHVtYm5haWxPdmVybGF5c1swXT8udGh1bWJuYWlsT3ZlcmxheVRpbWVTdGF0dXNSZW5kZXJlcj8udGV4dC5zaW1wbGVUZXh0KSB7XG4gICAgICAgIGR1cmF0aW9uRGF0YXMgPSB2aWRlby50aHVtYm5haWxPdmVybGF5c1swXT8udGh1bWJuYWlsT3ZlcmxheVRpbWVTdGF0dXNSZW5kZXJlcj8udGV4dC5zaW1wbGVUZXh0LnNwbGl0KCc6JykgIHx8ICcnXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZHVyYXRpb25EYXRhcyA9IFswLDBdXG4gICAgICB9XG4gICAgICBsZXQgbWludXRlczogbnVtYmVyID0gcGFyc2VJbnQoZHVyYXRpb25EYXRhc1swXSkgKiA2MFxuICAgICAgbGV0IHNlY29uZHM6IG51bWJlciA9IHBhcnNlSW50KGR1cmF0aW9uRGF0YXNbMV0pXG4gICAgICAvLyBEYXRlIGZvcm1hdGluZ1xuICAgICAgbGV0IHB1Ymxpc2hlZEF0ID0gIXNwZWVkRGF0ZSA/IGF3YWl0IGdldFZpZGVvRGF0ZShpZCkgOiB2aWRlby5wdWJsaXNoZWRUaW1lVGV4dD8ucnVuc1swXS50ZXh0IHx8ICcnXG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogIGlkLFxuICAgICAgICBvcmlnaW5hbF90aXRsZTogdmlkZW8ub3JpZ2luYWxfdGl0bGUsXG4gICAgICAgIHRpdGxlOlx0dmlkZW8udGl0bGUsXG4gICAgICAgIGFydGlzdDogdmlkZW8uYXJ0aXN0LFxuICAgICAgICBkdXJhdGlvbjpcdG1pbnV0ZXMrc2Vjb25kcyxcbiAgICAgICAgcHVibGlzaGVkQXQ6IHB1Ymxpc2hlZEF0LFxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmKHZpZGVvLmRpZFlvdU1lYW5SZW5kZXJlciB8fCB2aWRlby5zaG93aW5nUmVzdWx0c0ZvclJlbmRlcmVyKSB7XG4gICAgICB2aWRlbyA9IHZpZGVvLmRpZFlvdU1lYW5SZW5kZXJlciA/IHZpZGVvLmRpZFlvdU1lYW5SZW5kZXJlciA6IHZpZGVvLnNob3dpbmdSZXN1bHRzRm9yUmVuZGVyZXJcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkOiAgJ2RpZHlvdW1lYW4nLFxuICAgICAgICB0aXRsZTpcdHZpZGVvLmNvcnJlY3RlZFF1ZXJ5LnJ1bnNbMF0udGV4dCxcbiAgICAgICAgYXJ0aXN0OiAnJyxcbiAgICAgICAgZHVyYXRpb246XHQwLFxuICAgICAgICBwdWJsaXNoZWRBdDogJycsXG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoKGUpIHtcbiAgICBjb25zb2xlLmxvZyhlKVxuICB9XG59XG5cbmZ1bmN0aW9uIGNsZWFuVGl0bGUodGl0bGUpIHtcbiAgY29uc3QgYnJha2V0c1JlZ2V4ID0gL1xcW1teKV0qXFxdL1xuICBsZXQgZm9yYmlkZW5UZXJtcyA9IFsnKGZ1bGwgYWxidW0pJywgJyhvZmZpY2lhbCBlcCknLCAnKG9mZmljaWFsIHZpZGVvKScsICcocmFkaW8gZWRpdCknLF1cbiAgdGl0bGUgPSB0aXRsZS5yZXBsYWNlKGJyYWtldHNSZWdleCwgJycpXG4gIGZvcmJpZGVuVGVybXMuZm9yRWFjaChmb3JiaWRlblRlcm0gPT4ge1xuICAgIHRpdGxlID0gdGl0bGUucmVwbGFjZShuZXcgUmVnRXhwKGZvcmJpZGVuVGVybSwgJ2lnJyksICcnKVxuICAgIHRpdGxlID0gdGl0bGUucmVwbGFjZSgnKCknLCAnJylcbiAgfSlcbiAgcmV0dXJuIHRpdGxlXG59XG4iXX0=