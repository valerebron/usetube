"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function wait() {
    let ms = Math.floor(Math.random() * 300);
    let start = new Date().getTime();
    let end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}
exports.default = wait;
//# sourceMappingURL=wait.js.map