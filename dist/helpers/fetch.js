"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function nodeFetch(url, options) {
    try {
        if (typeof window === 'undefined') {
            return new Promise(function (resolve, reject) {
                var lib = url.startsWith('https') ? require('https') : require('http');
                var request = lib.get(url, options, function (response) {
                    if (response.statusCode < 200 || response.statusCode > 299) {
                        reject(new Error('Failed to load page, status code: ' + response.statusCode));
                    }
                    var body = [];
                    response.on('data', function (chunk) { return body.push(chunk); });
                    response.on('end', function () { return resolve(body.join('')); });
                });
                request.on('error', function (err) { return reject(err); });
            });
        }
    }
    catch (e) {
        console.log('nodeFetch error');
        console.log(e);
    }
}
exports.default = nodeFetch;
//# sourceMappingURL=fetch.js.map