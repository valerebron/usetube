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
const cleanTitle_1 = require("./helpers/cleanTitle");
const getVideoDesc_1 = require("./getVideoDesc");
const getVideoDate_1 = require("./getVideoDate");
const searchVideo_1 = require("./searchVideo");
function getVideosFromDesc(yt_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let videos = [];
            let desc = yield getVideoDesc_1.default(yt_id);
            if (desc) {
                let trackList = desc.pop().text.split('\n').filter(Boolean);
                trackList = trackList.filter(title => !title.includes('00:00'));
                trackList = trackList.filter(title => !title.startsWith(' '));
                if (trackList.length !== 0) {
                    loop1: for (let i = 0; i < trackList.length; i++) {
                        let elt = cleanTitle_1.default(trackList[i]).replace(/[0-9]?[0-9]?:[0-9]?[0-9]?/, '');
                        if (!elt || !elt.includes('-')) {
                            break loop1;
                        }
                        let title = elt.split('-')[1].trim();
                        let artist = elt.split('-')[0].trim();
                        let videosSearched = yield searchVideo_1.default(title + ' ' + artist);
                        loop2: for (let y = 0; y < videosSearched.videos.length; y++) {
                            let track = videosSearched.videos[y];
                            let original_title_lower = track.original_title.toLowerCase();
                            if (original_title_lower.includes(artist.split(' ')[0].toLowerCase()) && original_title_lower.includes(title.split(' ')[0].toLowerCase())) {
                                track.publishedAt = yield getVideoDate_1.default(track.id);
                                track.title = title;
                                track.artist = artist;
                                videos.push(track);
                                break loop2;
                            }
                            else {
                                continue loop2;
                            }
                        }
                    }
                }
            }
            return videos;
        }
        catch (e) {
            console.log('getVideosFromDesc error, maybe captcha to resolve');
            // console.log(e)
        }
    });
}
exports.default = getVideosFromDesc;
//# sourceMappingURL=getVideosFromDesc.js.map