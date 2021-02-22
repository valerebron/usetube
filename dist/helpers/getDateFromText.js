"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getDateFromText(dateTxt) {
    var unit = {
        second: {
            terms: ['sec', 'Sekun', 'segun'],
            factor: 1,
        },
        minute: {
            terms: ['min'],
            factor: 1000 * 60,
        },
        hour: {
            terms: ['hour', 'heure', 'uur'],
            factor: 1000 * 60 * 60,
        },
        day: {
            terms: ['jour', 'day', 'gio', 'dag', 'tag', 'day'],
            factor: 1000 * 60 * 60 * 24,
        },
        week: {
            terms: ['sem', 'week', 'setti', 'woche'],
            factor: 1000 * 60 * 60 * 24 * 7,
        },
        month: {
            terms: ['mo'],
            factor: 1000 * 60 * 60 * 24 * 7 * 4,
        },
        year: {
            terms: ['an', 'year', 'ja'],
            factor: 1000 * 60 * 60 * 24 * 7 * 4 * 12,
        },
    };
    var digit = parseInt(dateTxt.replace(/\D/g, '')) || 0;
    if (!dateTxt || digit === 0) {
        return new Date(Date.now());
    }
    for (var i in unit) {
        for (var y in unit[i].terms) {
            if (dateTxt.includes(unit[i].terms[y])) {
                var secondsSince = unit[i].factor * digit;
                return new Date(Date.now() - secondsSince);
            }
        }
    }
    return new Date(Date.now());
}
exports.default = getDateFromText;
//# sourceMappingURL=getDateFromText.js.map