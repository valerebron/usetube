"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function cleanTitle(title) {
    var braketsRegex = /\[[^)]*\]/;
    var forbidenTerms = ['(full album)', '(official ep)', '(official video)', '(video official)', '(radio edit)', '(DEEP MEDi Musik)', '(Original Mix)', '(Official Music Video)'];
    title = title.replace(braketsRegex, '');
    forbidenTerms.forEach(function (forbidenTerm) {
        title = title.replace(new RegExp(forbidenTerm, 'ig'), '');
        title = title.replace('()', '');
        title = title.replace(/\[(.*)\]/, '');
    });
    return title;
}
exports.default = cleanTitle;
//# sourceMappingURL=cleanTitle.js.map