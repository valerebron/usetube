"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function wait() {
    var ms = Math.floor(Math.random() * 300);
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}
exports.default = wait;
//# sourceMappingURL=wait.js.map