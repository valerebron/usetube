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
var axios_1 = require("axios");
var decodeHex_1 = require("./decodeHex");
var findVal_1 = require("./findVal");
function getData(urlstring) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var dataRegex, playerRegex, dateRegex, apiRegex, url, isAjax, isDate, isSubtitles, body, headers, data, raw, raw, apikey, data;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    dataRegex = /var\ ytInitialData\ \=\ \'(.*)\'\;<\/script>/;
                    playerRegex = /var\ ytInitialPlayerResponse\ \=\ (.*)id\=\"player\"/s;
                    dateRegex = /publishDate":"(.*)","ownerChannelName/;
                    apiRegex = /"innertubeApiKey":"(.*?)"/;
                    url = new URL(urlstring);
                    isAjax = false;
                    isDate = false;
                    isSubtitles = false;
                    if (url.searchParams.get('token')) {
                        isAjax = true;
                    }
                    if (url.searchParams.get('type') === 'date') {
                        isDate = true;
                    }
                    if (url.searchParams.get('type') === 'subtitles') {
                        isSubtitles = true;
                    }
                    if (!isAjax) return [3 /*break*/, 2];
                    data = { context: { client: { clientName: 'WEB', clientVersion: '2.20210401.08.00' } }, continuation: url.searchParams.get('token') };
                    return [4 /*yield*/, axios_1.default({ method: 'post', url: urlstring, data: data })];
                case 1:
                    body = (_c.sent()).data;
                    return [2 /*return*/, { items: findVal_1.default(body, 'continuationItems'), token: findVal_1.default(body, 'token') }];
                case 2:
                    headers = {
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'x-youtube-client-name': 1,
                            'x-youtube-client-version': '2.20200911.04.00',
                            'User-Agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Mobile Safari/537.36',
                        }
                    };
                    return [4 /*yield*/, axios_1.default(urlstring, headers)];
                case 3:
                    body = (_c.sent()).data;
                    if (isDate) {
                        raw = ((_a = dateRegex.exec(body)) === null || _a === void 0 ? void 0 : _a[1]) || '{}';
                        return [2 /*return*/, raw];
                    }
                    else {
                        raw = ((_b = dataRegex.exec(body)) === null || _b === void 0 ? void 0 : _b[1]) || '{}';
                        apikey = apiRegex.exec(body)[1] || '';
                        data = JSON.parse(decodeHex_1.default(raw));
                        data.apikey = apikey;
                        return [2 /*return*/, data];
                    }
                    _c.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.default = getData;
//# sourceMappingURL=getData.js.map