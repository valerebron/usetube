import axios, { AxiosRequestConfig } from 'axios'
import * as moment from 'moment'

export = {
  getVideoDate,
  getVideoDesc,
  getChannelDesc,
  searchVideo,
  searchChannel,
  getChannelVideos,
  getPlaylistVideos,
  getVideosFromDesc,
}

const headers: AxiosRequestConfig = {headers: {
  'Access-Control-Allow-Origin' : '*',
  'x-youtube-client-name': 1,
  'x-youtube-client-version': '2.20200911.04.00',
  'User-Agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Mobile Safari/537.36',
}}

const headersAJAX: AxiosRequestConfig = {headers: {
  'Access-Control-Allow-Origin' : '*',
  'User-Agent': 'hellobiczes',
  'x-youtube-client-name': 1,
  'x-youtube-client-version': '2.20200731.02.01'
}}

const mobileRegex  = /var\ ytInitialData\ \=\ \'(.*)\'\;<\/script>/
const dateRegex  = /publishDate":"(.*)","ownerChannelName/

function decodeHex(hex) {
  return hex.replace(/\\x22/g, '"').replace(/\\x7b/g, '{').replace(/\\x7d/g, '}').replace(/\\x5b/g, '[').replace(/\\x5d/g, ']').replace(/\\x3b/g, ';').replace(/\\x3d/g, '=').replace(/\\x27/g, '\'').replace(/\\\\/g, 'doubleAntiSlash').replace(/\\/g, '').replace(/doubleAntiSlash/g, '\\')
}

function wait() {
  let ms = Math.floor(Math.random() * 300)
  let start = new Date().getTime()
  let end = start
  while(end < start + ms) {
    end = new Date().getTime()
 }
}

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

async function getVideoDate(id: string) {
  try {
    const body: any = (await axios.get('https://m.youtube.com/watch?v='+id, headers)).data as string
    let publishText: any = dateRegex.exec(body) ?.[1] || '{}'
    publishText += ' '+Math.floor(Math.random() * 24)+'-'+Math.floor(Math.random() * 60)+'-'+Math.floor(Math.random() * 60)
    return moment(publishText, 'YYYY-MM-DD H-m-s').toDate()
  } catch(e) {
    console.log('cannot get date for '+id+', try again')
    console.log(e)
  }
}

async function getVideoDesc(id: string) {
  try {
    const body: any = (await axios.get('https://m.youtube.com/watch?v='+id, headers)).data as string
    const raw: any = mobileRegex.exec(body) ?.[1] || '{}'
    const data: any = JSON.parse(decodeHex(raw))
    let description: string = data.contents?.singleColumnWatchNextResults?.results?.results?.contents[1]?.itemSectionRenderer?.contents[0]?.slimVideoMetadataRenderer?.description?.runs || ''
    return description
  } catch(e) {
    console.log('video desc error for '+id, e)
  }
}

async function getChannelDesc(id: string) {
  try {
    const body: any = (await axios.get('https://m.youtube.com/channel/'+id+'/videos', headers)).data as string
    const raw: any = mobileRegex.exec(body) ?.[1] || '{}'
    const data: any = JSON.parse(decodeHex(raw))
    let description: string = data.metadata?.channelMetadataRenderer?.description || ''
    return description
  } catch(e) {
    console.log('channel desc error for '+id, e)
  }
}

async function searchVideo(terms: string, token?: string) {
  try {
    let items: any = []
    let videos: any = []
    let didyoumean: String = ''
    // initial videos search
    if(!token) {
      let body: any = (await axios.get('https://m.youtube.com/results?sp=EgIQAQ%253D%253D&videoEmbeddable=true&search_query='+encodeURI(terms), headers)).data as string
      let raw: any = mobileRegex.exec(body) ?.[1] || '{}'
      // let fs = require('fs'); fs.writeFile('wow.json', decodeHex(raw), (e)=>{console.log(e)})
      let datas: any = JSON.parse(decodeHex(raw)).contents.sectionListRenderer
      items = datas.contents[0].itemSectionRenderer.contents
      token = datas.continuations?.[0]?.reloadContinuationData?.continuation || ''
    }
    // more videos
    else {
      let data = (await axios.get('https://youtube.com/browse_ajax?ctoken='+token, headersAJAX)).data
      items = data[1].response.continuationContents?.gridContinuation?.items || ''
      token = data[1].response.continuationContents?.gridContinuation?.continuations?.[0]?.nextContinuationData?.continuation || ''
    }
    for(let i = 0; i < items.length; i++) {
      let formated = await formatVideo(items[i], true)
      if(formated.id === 'didyoumean') {
        didyoumean = formated.title
      }
      else {
        videos.push(formated)
      }
    }
    return {
      tracks: videos,
      didyoumean: didyoumean,
      token: token,
    }
  } catch(e) {
    console.log('search videos error, terms: '+terms, e)
  }
}

async function searchChannel(terms: string, token?: string) {
  try {
    let items: any = []
    let channels: any = []
    let didyoumean: String = ''
    if(!token) {
      const body: any = (await axios.get('https://m.youtube.com/results?sp=CAASAhAC&search_query='+encodeURI(terms), headers)).data as string
      const raw: any = mobileRegex.exec(body) ?.[1] || '{}'
      const data: any = JSON.parse(decodeHex(raw))
      items = data.contents.sectionListRenderer?.contents[0]?.itemSectionRenderer?.contents  
      token = data.continuations?.[0]?.reloadContinuationData?.continuation || ''
    }
    else {
      let data = (await axios.get('https://youtube.com/browse_ajax?ctoken='+token, headersAJAX)).data
      items = data[1].response.continuationContents?.gridContinuation?.items || ''
      token = data[1].response.continuationContents?.gridContinuation?.continuations?.[0]?.nextContinuationData?.continuation || ''
    }
    for(let i = 0; i < items.length; i++) {
      if(items[i].compactChannelRenderer) {
        const item = items[i].compactChannelRenderer
        let avatarSmall = item.thumbnail?.thumbnails[0].url || ''
        let avatarBig   = item.thumbnail?.thumbnails[1].url || ''
        avatarSmall = (avatarSmall.startsWith('//') ? 'https:'+avatarSmall : avatarSmall)
        avatarBig = (avatarBig.startsWith('//') ? 'https:'+avatarBig : avatarBig)
        
        const nbSubscriber = formatYoutubeCount(item.subscriberCountText?.runs[0].text)
        const nbVideo = formatYoutubeCount(item.videoCountText?.runs[0].text)

        channels.push({
          name:                  item.title.runs[0].text,
          channel_id:            item.channelId,
          nb_videos:             nbVideo,
          nb_subscriber:         nbSubscriber,
          official:              (item.ownerBadges ? true : false),
          channel_avatar_small:  avatarSmall,
          channel_avatar_medium: avatarBig,
        })
      }
      else if(items[i].didYouMeanRenderer || items[i].showingResultsForRenderer) {
        let item: any
        if(items[i].didYouMeanRenderer) {
          item = items[i].didYouMeanRenderer
        }
        else {
          item = items[i].showingResultsForRenderer
        }
        didyoumean = item.correctedQuery.runs[0].text
      }
    }
    return {
      channels: channels,
      didyoumean: didyoumean,
      token: token,
    }
  } catch(e) {
    console.log('search channel error, terms: '+terms, e)
  }
}

async function getChannelVideos(id: string, published_after?: Date) {
  try {
    const body: any = (await axios.get('https://m.youtube.com/channel/'+id+'/videos', headers)).data as string
    const raw: any = mobileRegex.exec(body) ?.[1] || '{}'
    // let fs = require('fs'); fs.writeFile('wow.json', decodeHex(raw), (e)=>{console.log(e)})
    const data: any = JSON.parse(decodeHex(raw))
    const items: any = data.contents?.singleColumnBrowseResultsRenderer?.tabs[1]?.tabRenderer?.content?.sectionListRenderer?.contents[0]?.itemSectionRenderer
    let token: string = items.continuations?.[0]?.nextContinuationData?.continuation || ''
    let videos: any = []
    for(let i = 0; i < items.contents.length; i++) {
      let video = await formatVideo(items.contents[i], false)
      if(moment(video.publishedAt).isBefore(published_after) && published_after) {
        return videos
      }
      else {
        videos.push(video)
      }
    }
    while(token !== '') {
      try {
        wait()
        let data = (await axios.get('https://youtube.com/browse_ajax?ctoken='+token, headersAJAX)).data
        let newVideos: any = data[1]?.response?.continuationContents?.gridContinuation?.items || ''
        token = data[1].response.continuationContents?.gridContinuation?.continuations?.[0]?.nextContinuationData?.continuation || ''
        for(let i = 0; i < newVideos.length; i++) {
          let video = await formatVideo(newVideos[i], false)
          if(moment(video.publishedAt).isBefore(published_after) && published_after) {
            return videos
          }
          else {
            videos.push(video)
          }
        }
      } catch(e) {
        console.log('getChannelVideos failed')
        console.log(e)
        token = ''
      }
    }
    return videos
  } catch(e) {
    console.log('cannot get channel videos for id: '+id+', try again')
    // getChannelVideos(id, published_after)
  }
}

async function getPlaylistVideos(id: string, speedDate?: boolean) {
  try {
    const body: any = (await axios.get('https://m.youtube.com/playlist?list='+id, headers)).data as string
    const raw: any = mobileRegex.exec(body) ?.[1] || '{}'
    const data: any = JSON.parse(decodeHex(raw))
    const items: any = data.contents?.singleColumnBrowseResultsRenderer?.tabs[0]?.tabRenderer?.content?.sectionListRenderer?.contents[0]?.itemSectionRenderer?.contents[0]?.playlistVideoListRenderer || ''
    let token: string = items.continuations[0]?.nextContinuationData.continuation || ''
    let videos: any = []
    for(let i = 0; i < items.contents.length; i++) {
      videos.push(await formatVideo(items.contents[i]), speedDate)
    }
    while(token !== '') {
      try {
        wait()
        const body: any = (await axios.get('https://m.youtube.com/playlist?ctoken='+token, headers)).data as string
        let nextRaw: any = mobileRegex.exec(body) ?.[1] || '{}'
        let nextData: any = JSON.parse(decodeHex(nextRaw)).continuationContents.playlistVideoListContinuation
        let nextVideos: any = nextData.contents
        if(nextData.continuations) {
          token = nextData.continuations[0]?.nextContinuationData.continuation
        }
        else {
          token = ''
        }
        for(let i = 0; i < nextVideos.length; i++) {
          videos.push(await formatVideo(nextVideos[i]), speedDate)
        }
      } catch(e) {
        console.log('getPlaylistVideos failed')
        console.log(e)
        token = ''
      }
    }
    return videos
  } catch(e) {
    console.log('cannot get playlist '+id+', try again')
    console.log(e)
  }
}

async function getVideosFromDesc(yt_id) {
  try {
    let tracks = []
    let desc: any = await getVideoDesc(yt_id)
    if(desc) {
      let trackList = desc.pop().text.split('\n').filter(Boolean)
      trackList = trackList.filter(title => !title.includes('00:00'))
      trackList = trackList.filter(title => !title.startsWith(' '))
      if(trackList.length !== 0) {
        loop1:
        for(let i = 0; i < trackList.length; i++) {
          let elt = cleanTitle(trackList[i]).replace(/[0-9]?[0-9]?:[0-9]?[0-9]?/,'')
          if(!elt || !elt.includes('-')) {
            break loop1
          }
          let title = elt.split('-')[1].trim()
          let artist = elt.split('-')[0].trim()
          let tracksSearched = await searchVideo(title+' '+artist)
          loop2:
          for(let y = 0; y < tracksSearched.tracks.length; y++) {
            let track = tracksSearched.tracks[y]
            let original_title_lower = track.original_title.toLowerCase()
            if(original_title_lower.includes(artist.split(' ')[0].toLowerCase()) && original_title_lower.includes(title.split(' ')[0].toLowerCase())) {
              track.publishedAt = await getVideoDate(track.id)
              track.title = title
              track.artist = artist
              tracks.push(track)
              break loop2
            }
            else {
              continue loop2
            }
          }
        }
      }
    }
    return tracks
  } catch(e) {
    console.log(e)
  }
}

async function formatVideo(video: any, speedDate?: boolean) {
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
      let id: string = video.videoId
      let durationDatas: any = 0
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
      let minutes: number = parseInt(durationDatas[0]) * 60
      let seconds: number = parseInt(durationDatas[1])
      // Date formating
      let publishedAt = !speedDate ? await getVideoDate(id) : video.publishedTimeText?.runs[0].text || ''
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
        title:	video.correctedQuery.runs[0].text,
        artist: '',
        duration:	0,
        publishedAt: '',
      }
    }
  } catch(e) {
    console.log('format video failed')
    // console.log(e)
  }
}
