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
const wait_1 = require("./helpers/wait");
const formatVideo_1 = require("./helpers/formatVideo");
function getPlaylistVideos(id, speedDate) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield getData_1.default('https://m.youtube.com/playlist?list=' + id);
            const items = ((_j = (_h = (_g = (_f = (_e = (_d = (_c = (_b = (_a = data.contents) === null || _a === void 0 ? void 0 : _a.singleColumnBrowseResultsRenderer) === null || _b === void 0 ? void 0 : _b.tabs[0]) === null || _c === void 0 ? void 0 : _c.tabRenderer) === null || _d === void 0 ? void 0 : _d.content) === null || _e === void 0 ? void 0 : _e.sectionListRenderer) === null || _f === void 0 ? void 0 : _f.contents[0]) === null || _g === void 0 ? void 0 : _g.itemSectionRenderer) === null || _h === void 0 ? void 0 : _h.contents[0]) === null || _j === void 0 ? void 0 : _j.playlistVideoListRenderer) || '';
            let token = ((_k = items.continuations[0]) === null || _k === void 0 ? void 0 : _k.nextContinuationData.continuation) || '';
            let videos = [];
            for (let i = 0; i < items.contents.length; i++) {
                videos.push(yield formatVideo_1.default(items.contents[i], speedDate));
            }
            while (token !== '') {
                try {
                    wait_1.default();
                    let nextData = yield getData_1.default('https://m.youtube.com/playlist?ctoken=' + token);
                    let nextVideos = nextData.continuationContents.playlistVideoListContinuation.contents;
                    if (nextData.continuations) {
                        token = (_l = nextData.continuations[0]) === null || _l === void 0 ? void 0 : _l.nextContinuationData.continuation;
                    }
                    else {
                        token = '';
                    }
                    for (let i = 0; i < nextVideos.length; i++) {
                        videos.push(yield formatVideo_1.default(nextVideos[i], speedDate));
                    }
                }
                catch (e) {
                    console.log('getPlaylistVideos failed');
                    // console.log(e)
                    token = '';
                }
            }
            return videos;
        }
        catch (e) {
            console.log('cannot get playlist ' + id + ', try again');
            // console.log(e)
        }
    });
}
exports.default = getPlaylistVideos;
//# sourceMappingURL=getPlaylistVideos.js.map