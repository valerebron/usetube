const usetube = require('../dist/usetube.js')
// import usetube from '../dist/node/usetube.js'
// const fetch = require('node-fetch')

let test

let launchTest = async function() {
  // test = await fetch('https://www.youtube.com/channel/UCcdNy_FqMi0z1VU6kanOvFQ/')
  // test = await test.text()

  // test = await usetube.getChannelVideos('UC0EXZm7W7F7px2rcqecyC6w', new Date(Date.now() - 10*24*60*60*1000))
  // test = await usetube.getChannelVideos('UClRWn7AYVgajjiYPsS0VGWQ')
  // test = await usetube.getVideoDesc('P7pxZ01MmUU')
  // test = await usetube.getChannelDesc('UCp5KUL1Mb7Kpfw10SGyPumQ')
  // test = await usetube.searchChannel('noisiaa')
  test = await usetube.searchVideo('Lorn')
  // test = await usetube.getVideoDate('i0Q0HIpvkhU')
  // test = await usetube.getPlaylistVideos('PLKuN-WEIzl_pwo3US7XyZJe1oVCD7NLwF', true)
  // test = await usetube.getVideosFromDesc('mTNfHrUwQkE')
  if(test) {
    console.log(test)
    if(test.length) {
      console.log(test.length)
    }
  }
}

launchTest()
