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
const formatVideo_1 = require("./helpers/formatVideo");
const wait_1 = require("./helpers/wait");
function getChannelVideos(id, published_after) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield getData_1.default('https://m.youtube.com/channel/' + id + '/videos');
            const channel = (_g = (_f = (_e = (_d = (_c = (_b = (_a = data.contents) === null || _a === void 0 ? void 0 : _a.singleColumnBrowseResultsRenderer) === null || _b === void 0 ? void 0 : _b.tabs[1]) === null || _c === void 0 ? void 0 : _c.tabRenderer) === null || _d === void 0 ? void 0 : _d.content) === null || _e === void 0 ? void 0 : _e.sectionListRenderer) === null || _f === void 0 ? void 0 : _f.contents[0]) === null || _g === void 0 ? void 0 : _g.itemSectionRenderer;
            let token = ((_k = (_j = (_h = channel.continuations) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.nextContinuationData) === null || _k === void 0 ? void 0 : _k.continuation) || '';
            let videos = [];
            for (let i = 0; i < channel.contents.length; i++) {
                let video = yield formatVideo_1.default(channel.contents[i], false);
                if ((published_after && video.publishedAt.getTime() > published_after.getTime()) || !published_after) {
                    videos.push(video);
                }
                else {
                    return videos;
                }
            }
            while (token !== '') {
                try {
                    wait_1.default();
                    let data = yield getData_1.default('https://youtube.com/browse_ajax?ctoken=' + token);
                    let newVideos = data.items;
                    token = data.token;
                    for (let i = 0; i < newVideos.length; i++) {
                        let video = yield formatVideo_1.default(newVideos[i], false);
                        if (published_after) {
                            if (video.publishedAt.getTime() > published_after.getTime()) {
                                videos.push(video);
                            }
                        }
                        else {
                            return videos;
                        }
                    }
                }
                catch (e) {
                    console.log('getChannelVideos failed');
                    // console.log(e)
                    token = '';
                }
            }
            return videos;
        }
        catch (e) {
            console.log('cannot get channel videos for id: ' + id + ', try again');
            // console.log(e)
        }
    });
}
exports.default = getChannelVideos;
//# sourceMappingURL=getChannelVideos.js.map