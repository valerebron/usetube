const usetube = require('../dist/usetube.min.js')
let test = async function() {
  // let wow = await usetube.getChannelDesc('UCp5KUL1Mb7Kpfw10SGyPumQ')
  let wow = await usetube.searchChannel('pokimane')
  console.log(wow)
}

test()