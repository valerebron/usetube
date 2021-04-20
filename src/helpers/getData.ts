import axios from 'axios'
import decodeHex from './decodeHex'
import findVal from './findVal'

export default async function getData(urlstring: string) {
  const dataRegex  = /var\ ytInitialData\ \=\ \'(.*)\'\;<\/script>/
  const playerRegex  = /var\ ytInitialPlayerResponse\ \=\ (.*)id\=\"player\"/s
  
  const dateRegex  = /publishDate":"(.*)","ownerChannelName/
  const apiRegex  = /"innertubeApiKey":"(.*?)"/
  let url = new URL(urlstring)
  let isAjax = false
  let isDate = false
  let isSubtitles = false
  let body
  if(url.searchParams.get('token')) {
    isAjax = true
  }
  if(url.searchParams.get('type') === 'date') {
    isDate = true
  }
  if(url.searchParams.get('type') === 'subtitles') {
    isSubtitles = true
  }
  let headers: any
  if(isAjax || isSubtitles) {
    const data = { context: { client: { clientName: 'WEB', clientVersion: '2.20210401.08.00' } }, continuation: url.searchParams.get('token') }
    body = (await axios({ method: 'post', url: urlstring, data: data })).data
    if(isSubtitles) {
      let raw = playerRegex.exec(body) ?.[0] || '{}'
      raw = raw.replace(';</script><div id="player"', '').replace('var ytInitialPlayerResponse = ', '')
      raw = JSON.parse(raw)
      let  urlSubtitles = findVal(raw, 'captionTracks')
      urlSubtitles = urlSubtitles[0].baseUrl
      return await axios({ method: 'post', url: urlSubtitles+'&fmt=json3', data: data })
    }
    else {
      return { items: findVal(body, 'continuationItems'), token: findVal(body, 'token')}
    }
  }
  else {
    headers = {
      headers: {
        'Access-Control-Allow-Origin' : '*',
        'x-youtube-client-name': 1,
        'x-youtube-client-version': '2.20200911.04.00',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Mobile Safari/537.36',
      }
    }
    body = (await axios.get(urlstring, headers)).data
    if(isDate) {
      const raw = dateRegex.exec(body) ?.[1] || '{}'
      return raw
    }
    else {
      const raw = dataRegex.exec(body) ?.[1] || '{}'
      const apikey = apiRegex.exec(body)[1] || ''
      // let fs = require('fs'); fs.writeFile('raw.json', decodeHex(raw), (e)=>{console.log(e)})
      let data = JSON.parse(decodeHex(raw))
      data.apikey = apikey
      return data
    }
  }
}
