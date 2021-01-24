var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const fetch = require('node-fetch');
const usetube = require('../dist/usetube.min.js');
let test = function () {
    return __awaiter(this, void 0, void 0, function* () {
        //   let wow = await fetch('https://www.youtube.com/channel/UCcdNy_FqMi0z1VU6kanOvFQ/')
        //   let wow = await usetube.getChannelVideos('UCp5KUL1Mb7Kpfw10SGyPumQ')
        // let wow = await usetube.getChannelVideos('UC6eCu3YVjhlB1mjRILyw0tQ')
        // let wow = await usetube.getVideoDesc('TupbkwAkRb8')
        //   let wow = await usetube.getChannelDesc('UCp5KUL1Mb7Kpfw10SGyPumQ')
        //   let wow = await usetube.searchChannel('noisiaa')
        let wow = yield usetube.searchVideo('IMANU - Music To Stay In Your House To (Buunshin’s Go Outside Remix)');
        // let wow = await usetube.getVideoDate('i0Q0HIpvkhU')
        // let wow = await usetube.getPlaylistVideos('PLKuN-WEIzl_pwo3US7XyZJe1oVCD7NLwF', true)
        console.log(wow);
        console.log(wow.length);
    });
};
test();
