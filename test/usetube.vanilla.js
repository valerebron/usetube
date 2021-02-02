function cleanTitle(title) {
  const braketsRegex = /\[[^)]*\]/
  let forbidenTerms = ['(full album)', '(official ep)', '(official video)', '(video official)', '(radio edit)','(DEEP MEDi Musik)', '(Original Mix)', '(Official Music Video)']
  title = title.replace(braketsRegex, '')
  forbidenTerms.forEach(forbidenTerm => {
    title = title.replace(new RegExp(forbidenTerm, 'ig'), '')
    title = title.replace('()', '')
    title = title.replace(/\[(.*)\]/, '')
  })
  return title
}

function decodeHex(hex) {
  return hex.replace(/\\x22/g, '"').replace(/\\x7b/g, '{').replace(/\\x7d/g, '}').replace(/\\x5b/g, '[').replace(/\\x5d/g, ']').replace(/\\x3b/g, ';').replace(/\\x3d/g, '=').replace(/\\x27/g, '\'').replace(/\\\\/g, 'doubleAntiSlash').replace(/\\/g, '').replace(/doubleAntiSlash/g, '\\')
}

function formatYoutubeCount(raw) {
  const isMill = raw?.includes('M')
  const isKilo = raw?.includes('k')
  let nbSubscriber = raw?.replace(/[^0-9,.]/g, '').replace(',', '.')
  if(isMill) { 
    nbSubscriber *= 1000000
  }
  else if(isKilo) {
    nbSubscriber *= 1000
  }
  return parseInt(nbSubscriber) || 0
}

function wait() {
  let ms = Math.floor(Math.random() * 300)
  let start = new Date().getTime()
  let end = start
  while(end < start + ms) {
    end = new Date().getTime()
 }
}

function getDateFromText(dateTxt) {
  const unit = {
    second: {
      terms: ['sec', 'Sekun', 'segun'],
      factor: 1,
    },
    minute: {
      terms: ['min'],
      factor: 1000*60,
    },
    hour: {
      terms: ['hour', 'heure', 'uur'],
      factor: 1000*60*60,
    },
    day: {
      terms: ['jour', 'day', 'gio', 'dag', 'tag', 'day'],
      factor: 1000*60*60*24,
    },
    week: {
      terms: ['sem', 'week', 'setti', 'woche'],
      factor: 1000*60*60*24*7,
    },
    month: {
      terms: ['mo'],
      factor: 1000*60*60*24*7*4,
    },
    year: {
      terms: ['an', 'year', 'ja'],
      factor: 1000*60*60*24*7*4*12,
    },
  }
  const digit = parseInt(dateTxt.replace(/\D/g,'')) || 0

  if(!dateTxt || digit === 0) {
    return new Date(Date.now())
  }

  for(let i in unit) {
    for(let y in unit[i].terms) {
      if(dateTxt.includes(unit[i].terms[y])) {
        const secondsSince = unit[i].factor * digit
        return new Date(Date.now() - secondsSince)
      }
    }
  }
  return new Date(Date.now())
}

async function getData(urlstring) {
  const dataRegex  = /var\ ytInitialData\ \=\ \'(.*)\'\;<\/script>/
  const dateRegex  = /publishDate":"(.*)","ownerChannelName/
  let url = new URL(urlstring)
  let isAjax = false
  let isDate = false
  let body
  if(url.searchParams.get('ctoken')) {
    isAjax = true
  }
  if(url.searchParams.get('type') === 'date') {
    isDate = true
  }
  let headers
  if(isAjax) {
    headers =  {
      'Access-Control-Allow-Origin' : '*',
      'User-Agent': 'hellobiczes',
      'x-youtube-client-name': 1,
      'x-youtube-client-version': '2.20200731.02.01'
    }
  }
  else {
    headers = {
      'Access-Control-Allow-Origin' : '*',
      'x-youtube-client-name': 1,
      'x-youtube-client-version': '2.20200911.04.00',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Mobile Safari/537.36',
    }
  }

  try {
    fetch(urlstring, {
      mode: 'no-cors',
      headers: headers,
    }).catch(error => { console.log(error) })
  }
  catch(e) {
    console.log(e)
  }

  if(isAjax) {
    // let fs = require('fs'); fs.writeFile('raw.json', body, (e)=>{console.log(e)})
    let json = JSON.parse(body)
    const ajaxData = json[1].response.continuationContents?.gridContinuation
    return { items: ajaxData.items, token: ajaxData.continuations?.[0]?.nextContinuationData?.continuation || ''}
  }
  else {
    if(isDate) {
      const raw = dateRegex.exec(body) ?.[1] || '{}'
      return raw
    }
    else {
      const raw = dataRegex.exec(body) ?.[1] || '{}'
      // let fs = require('fs'); fs.writeFile('raw.json', decodeHex(raw), (e)=>{console.log(e)})
      return JSON.parse(decodeHex(raw))
    }
  }
}

async function formatVideo(video, speedDate = false) {
  try{
    if(video.compactVideoRenderer || video.gridVideoRenderer || video.playlistVideoRenderer ) {
      if(video.compactVideoRenderer) {
        video = video.compactVideoRenderer
      }
      else if(video.gridVideoRenderer) {
        video = video.gridVideoRenderer
      }
      else if(video.playlistVideoRenderer ) {
        video = video.playlistVideoRenderer
      }
      let id = video.videoId
      let durationDatas = 0
      // get title
      if(video.title.simpleText) {
        video.title = video.title.simpleText
      }
      else if(video.title.runs[0].text) {
        video.title = video.title.runs[0].text
      }
      else {
        video.title = ''
      }
      // title formating
      video.original_title = video.title

      if(video.title.split('-').length === 1) {
        video.artist = ''
      }
      else {
        let splited = video.original_title.match(/([^,]*)-(.*)/)
        video.artist = splited[1]
        video.title = splited[2]
      }
      // duration formating
      if(video.lengthText) {
        durationDatas = video.lengthText.runs[0].text.split(':')
      }
      else if(video.thumbnailOverlays[0]?.thumbnailOverlayTimeStatusRenderer?.text.simpleText) {
        durationDatas = video.thumbnailOverlays[0]?.thumbnailOverlayTimeStatusRenderer?.text.simpleText.split(':')  || ''
      }
      else {
        durationDatas = [0,0]
      }
      let minutes = parseInt(durationDatas[0]) * 60
      let seconds = parseInt(durationDatas[1])
      // Date formating
      let publishedAt = speedDate ? getDateFromText(video.publishedTimeText?.runs[0].text || '') : await getVideoDate(id)
      return {
        id:  id,
        original_title: video.original_title.trim(),
        title:	video.title.trim(),
        artist: video.artist.trim(),
        duration:	minutes+seconds,
        publishedAt: publishedAt,
      }
    }
    else if(video.didYouMeanRenderer || video.showingResultsForRenderer) {
      video = video.didYouMeanRenderer ? video.didYouMeanRenderer : video.showingResultsForRenderer
      return {
        id:  'didyoumean',
        original_title: '',
        title:	video.correctedQuery.runs[0].text,
        artist: '',
        duration:	0,
        publishedAt: new Date(Date.now()),
      }
    }
  } catch(e) {
    console.log('format video failed')
    // console.log(e)
  }
}

async function getChannelDesc(id) {
  try {
    const data = await getData('https://m.youtube.com/channel/'+id+'/videos')
    let description = data.metadata?.channelMetadataRenderer?.description || ''
    return description
  } catch(e) {
    console.log('channel desc error for '+id)
    // console.log(e)
  }
}
