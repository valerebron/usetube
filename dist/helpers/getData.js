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
const fetch_1 = require("./fetch");
const decodeHex_1 = require("./decodeHex");
function getData(urlstring) {
    var _a, _b, _c, _d, _e, _f;
    return __awaiter(this, void 0, void 0, function* () {
        const dataRegex = /var\ ytInitialData\ \=\ \'(.*)\'\;<\/script>/;
        const dateRegex = /publishDate":"(.*)","ownerChannelName/;
        let url = new URL(urlstring);
        let isAjax = false;
        let isDate = false;
        let body;
        if (url.searchParams.get('ctoken')) {
            isAjax = true;
        }
        if (url.searchParams.get('type') === 'date') {
            isDate = true;
        }
        let headers;
        if (isAjax) {
            headers = {
                'Access-Control-Allow-Origin': '*',
                'User-Agent': 'hellobiczes',
                'x-youtube-client-name': 1,
                'x-youtube-client-version': '2.20200731.02.01'
            };
        }
        else {
            headers = {
                'Access-Control-Allow-Origin': '*',
                'x-youtube-client-name': 1,
                'x-youtube-client-version': '2.20200911.04.00',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Mobile Safari/537.36',
            };
        }
        if (typeof window === 'undefined') { // node
            body = yield fetch_1.default(urlstring, {
                mode: 'no-cors',
                headers: headers
            });
        }
        else { // browser
            try {
                body = yield fetch(urlstring, {
                    mode: 'no-cors',
                    headers: headers,
                });
                body = yield body.text();
            }
            catch (e) {
                console.log(e);
            }
        }
        if (isAjax) {
            // let fs = require('fs'); fs.writeFile('raw.json', body, (e)=>{console.log(e)})
            let json = JSON.parse(body);
            const ajaxData = (_a = json[1].response.continuationContents) === null || _a === void 0 ? void 0 : _a.gridContinuation;
            return { items: ajaxData.items, token: ((_d = (_c = (_b = ajaxData.continuations) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.nextContinuationData) === null || _d === void 0 ? void 0 : _d.continuation) || '' };
        }
        else {
            if (isDate) {
                const raw = ((_e = dateRegex.exec(body)) === null || _e === void 0 ? void 0 : _e[1]) || '{}';
                return raw;
            }
            else {
                const raw = ((_f = dataRegex.exec(body)) === null || _f === void 0 ? void 0 : _f[1]) || '{}';
                // let fs = require('fs'); fs.writeFile('raw.json', decodeHex(raw), (e)=>{console.log(e)})
                return JSON.parse(decodeHex_1.default(raw));
            }
        }
    });
}
exports.default = getData;
//# sourceMappingURL=getData.js.map