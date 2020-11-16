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
const headers = { headers: {
        'Access-Control-Allow-Origin': '*',
        'x-youtube-client-name': 1,
        'x-youtube-client-version': '2.20200911.04.00',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Mobile Safari/537.36',
    } };
const mobileRegex = /id\=\"initial\-data\"\>\<\!\-\-\ (.*)\ \-\-\>\<\/div\>\<script\ \>if/;
function test() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    return __awaiter(this, void 0, void 0, function* () {
        const id = 'UCcdNy_FqMi0z1VU6kanOvFQ';
        const body = (yield axios_1.default.get('https://m.youtube.com/channel/' + encodeURI(id) + '/videos', headers)).data;
        const raw = ((_a = mobileRegex.exec(body)) === null || _a === void 0 ? void 0 : _a[1]) || '{}';
        const data = JSON.parse(raw);
        const items = (_h = (_g = (_f = (_e = (_d = (_c = (_b = data.contents) === null || _b === void 0 ? void 0 : _b.singleColumnBrowseResultsRenderer) === null || _c === void 0 ? void 0 : _c.tabs[1]) === null || _d === void 0 ? void 0 : _d.tabRenderer) === null || _e === void 0 ? void 0 : _e.content) === null || _f === void 0 ? void 0 : _f.sectionListRenderer) === null || _g === void 0 ? void 0 : _g.contents[0]) === null || _h === void 0 ? void 0 : _h.itemSectionRenderer;
        let token = ((_l = (_k = (_j = items.continuations) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.nextContinuationData) === null || _l === void 0 ? void 0 : _l.continuation) || '';
        let videos = [];
        console.log(items.contents);
    });
}
test();
