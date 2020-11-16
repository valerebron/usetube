var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const usetube = require('../dist/usetube.min.js');
let test = function () {
    return __awaiter(this, void 0, void 0, function* () {
        // let wow = await usetube.getChannelVideos('UCp5KUL1Mb7Kpfw10SGyPumQ')
        // let wow = await usetube.getChannelVideos('UCcdNy_FqMi0z1VU6kanOvFQ', '2020-11-10T23:35:38.000Z')
        // let wow = await usetube.getChannelDesc('UCp5KUL1Mb7Kpfw10SGyPumQ')
        // let wow = await usetube.searchChannel('noisiaa')
        let wow = yield usetube.searchVideo('noisiaa');
        console.log(wow);
    });
};
test();
