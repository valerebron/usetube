"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function formatYoutubeCount(raw) {
    const isMill = raw === null || raw === void 0 ? void 0 : raw.includes('M');
    const isKilo = raw === null || raw === void 0 ? void 0 : raw.includes('k');
    let nbSubscriber = raw === null || raw === void 0 ? void 0 : raw.replace(/[^0-9,.]/g, '').replace(',', '.');
    if (isMill) {
        nbSubscriber *= 1000000;
    }
    else if (isKilo) {
        nbSubscriber *= 1000;
    }
    return parseInt(nbSubscriber) || 0;
}
exports.default = formatYoutubeCount;
//# sourceMappingURL=formatYoutubeCount.js.map