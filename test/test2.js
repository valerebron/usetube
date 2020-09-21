const usetube = require('../out/index').default
let test = async function() {
  // let wow = await usetube.getVideoDate('1Bix44C1EzY')
  // let wow = await usetube.searchVideo('usetube')
  let wow = await usetube.getChannelDesc('UCp5KUL1Mb7Kpfw10SGyPumQ')
  console.log(wow)
}

test()