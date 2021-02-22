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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var getData_1 = require("./helpers/getData");
var formatVideo_1 = require("./helpers/formatVideo");
function searchVideo(terms, token) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    return __awaiter(this, void 0, void 0, function () {
        var items, videos, didyoumean, data, data, i, formated, e_1;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    _l.trys.push([0, 9, , 10]);
                    items = [];
                    videos = [];
                    didyoumean = '';
                    if (!!token) return [3 /*break*/, 2];
                    return [4 /*yield*/, getData_1.default('https://m.youtube.com/results?sp=EgIQAQ%253D%253D&videoEmbeddable=true&search_query=' + encodeURI(terms))];
                case 1:
                    data = _l.sent();
                    items = data.contents.sectionListRenderer.contents[0].itemSectionRenderer.contents;
                    token = ((_c = (_b = (_a = data.continuations) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.reloadContinuationData) === null || _c === void 0 ? void 0 : _c.continuation) || '';
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, getData_1.default('https://youtube.com/browse_ajax?ctoken=' + token)];
                case 3:
                    data = _l.sent();
                    items = ((_e = (_d = data[1].response.continuationContents) === null || _d === void 0 ? void 0 : _d.gridContinuation) === null || _e === void 0 ? void 0 : _e.items) || '';
                    token = ((_k = (_j = (_h = (_g = (_f = data[1].response.continuationContents) === null || _f === void 0 ? void 0 : _f.gridContinuation) === null || _g === void 0 ? void 0 : _g.continuations) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.nextContinuationData) === null || _k === void 0 ? void 0 : _k.continuation) || '';
                    _l.label = 4;
                case 4:
                    i = 0;
                    _l.label = 5;
                case 5:
                    if (!(i < items.length)) return [3 /*break*/, 8];
                    return [4 /*yield*/, formatVideo_1.default(items[i], true)];
                case 6:
                    formated = _l.sent();
                    if (formated.id === 'didyoumean') {
                        didyoumean = formated.title;
                    }
                    else {
                        videos.push(formated);
                    }
                    _l.label = 7;
                case 7:
                    i++;
                    return [3 /*break*/, 5];
                case 8: return [2 /*return*/, {
                        videos: videos,
                        didyoumean: didyoumean,
                        token: token,
                    }];
                case 9:
                    e_1 = _l.sent();
                    console.log('search videos error, terms: ' + terms);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
exports.default = searchVideo;
//# sourceMappingURL=searchVideo.js.map