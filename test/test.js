const usetube = require('../out/index')
const chai = require('chai')
chai.use(require('chai-as-promised'))
const expect = chai.expect

const videoId = '1Bix44C1EzY'
const channelId = 'PLXJzeXpFb-pDFQSy6EK7JEFRM1b8I1TTW'

const properResult = {

}

describe("usetube", function() {
    this.timeout(30000)
    this.slow(99999999)

    it('should return proper results', async () => {
        let playlist = await usetube(myTestList)
        for(let prop in properResult)
            expect(playlist[prop]).to.deep.eq(properResult[prop])
    })

    it('should scrap >100 videos', async () => {
        expect((await usetube(top500Playlist)).videos.length).to.be.gt(100)
    })
})