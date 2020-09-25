const usetube = require('../dist/usetube.js')
let test = async function() {
  let wow = await usetube.getChannelDesc('UCp5KUL1Mb7Kpfw10SGyPumQ')
  console.log(wow)
}

test()