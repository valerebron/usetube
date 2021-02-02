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
const getVideoDate_1 = require("../getVideoDate");
const getDateFromText_1 = require("./getDateFromText");
function formatVideo(video, speedDate = false) {
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
                let publishedAt = speedDate ? getDateFromText_1.default(((_e = video.publishedTimeText) === null || _e === void 0 ? void 0 : _e.runs[0].text) || '') : yield getVideoDate_1.default(id);
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
                    original_title: '',
                    title: video.correctedQuery.runs[0].text,
                    artist: '',
                    duration: 0,
                    publishedAt: new Date(Date.now()),
                };
            }
        }
        catch (e) {
            console.log('format video failed');
            // console.log(e)
        }
    });
}
exports.default = formatVideo;
//# sourceMappingURL=formatVideo.js.map