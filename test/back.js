const usetube = require('../dist/usetube.min.js')
let test = async function() {
  // let wow = await usetube.getChannelVideos('UCp5KUL1Mb7Kpfw10SGyPumQ')
  let wow = await usetube.getChannelVideos('UCcdNy_FqMi0z1VU6kanOvFQ', '2020-11-10T23:35:38.000Z')
  // let wow = await usetube.getChannelDesc('UCp5KUL1Mb7Kpfw10SGyPumQ')
  // let wow = await usetube.searchChannel('noisiaa')
  // let wow = await usetube.searchVideo('noisiaa')
  // let wow = await usetube.getVideoDate('i0Q0HIpvkhU')
  console.log(wow)
}
test()
