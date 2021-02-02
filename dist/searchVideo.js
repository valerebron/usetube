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
function searchVideo(terms, token) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let items = [];
            let videos = [];
            let didyoumean = '';
            // initial videos search
            if (!token) {
                let data = yield getData_1.default('https://m.youtube.com/results?sp=EgIQAQ%253D%253D&videoEmbeddable=true&search_query=' + encodeURI(terms));
                items = data.contents.sectionListRenderer.contents[0].itemSectionRenderer.contents;
                token = ((_c = (_b = (_a = data.continuations) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.reloadContinuationData) === null || _c === void 0 ? void 0 : _c.continuation) || '';
            }
            // more videos
            else {
                let data = yield getData_1.default('https://youtube.com/browse_ajax?ctoken=' + token);
                items = ((_e = (_d = data[1].response.continuationContents) === null || _d === void 0 ? void 0 : _d.gridContinuation) === null || _e === void 0 ? void 0 : _e.items) || '';
                token = ((_k = (_j = (_h = (_g = (_f = data[1].response.continuationContents) === null || _f === void 0 ? void 0 : _f.gridContinuation) === null || _g === void 0 ? void 0 : _g.continuations) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.nextContinuationData) === null || _k === void 0 ? void 0 : _k.continuation) || '';
            }
            for (let i = 0; i < items.length; i++) {
                let formated = yield formatVideo_1.default(items[i], true);
                if (formated.id === 'didyoumean') {
                    didyoumean = formated.title;
                }
                else {
                    videos.push(formated);
                }
            }
            return {
                videos: videos,
                didyoumean: didyoumean,
                token: token,
            };
        }
        catch (e) {
            console.log('search videos error, terms: ' + terms);
            // console.log(e)
        }
    });
}
exports.default = searchVideo;
//# sourceMappingURL=searchVideo.js.map