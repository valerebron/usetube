import axios, { AxiosRequestConfig } from 'axios'
import * as moment from 'moment'

export = {
  getVideoDate,
  getChannelDesc,
  searchVideo,
  searchChannel,
  getChannelVideos,
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

const videoRegex = /ytInitialPlayerConfig\ \=\ (.*)\;\n\ \ \ \ \ \ setTimeout/
const mobileRegex  = /id\=\"initial\-data\"\>\<\!\-\-\ (.*)\ \-\-\>\<\/div\>\<script\ \>if/

function wait(ms) {
  var start = new Date().getTime()
  var end = start
  while(end < start + ms) {
    end = new Date().getTime()
 }
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
    const raw: any = videoRegex.exec(body) ?.[1] || '{}'
    const datas: any = JSON.parse(raw)
    let publishText: any = JSON.parse(datas.args.player_response).microformat?.playerMicroformatRenderer?.publishDate
    publishText += ' '+Math.floor(Math.random() * 24)+'-'+Math.floor(Math.random() * 60)+'-'+Math.floor(Math.random() * 60)
    return moment(publishText, 'YYYY-MM-DD H-m-s').toDate()
  } catch(e) {
    console.log('get date error for '+id+', try again', e)
    getVideoDate(id)
  }
}

async function getChannelDesc(id: string) {
  try {
    const body: any = (await axios.get('https://m.youtube.com/channel/'+encodeURI(id)+'/videos', headers)).data as string
    const raw: any = mobileRegex.exec(body) ?.[1] || '{}'
    const data: any = JSON.parse(raw)
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
    // initial videos search
    if(!token) {
      let body: any = (await axios.get('https://m.youtube.com/results?sp=EgIQAQ%253D%253D&videoEmbeddable=true&search_query='+terms, headers)).data as string
      let raw: any = mobileRegex.exec(body) ?.[1] || '{}'
      let datas: any = JSON.parse(raw).contents.sectionListRenderer
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
      videos.push(await formatVideo(items[i], true))
    }
    return {
      tracks: videos,
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
    if(!token) {
      const body: any = (await axios.get('https://m.youtube.com/results?sp=CAASAhAC&search_query='+encodeURI(terms), headers)).data as string
      const raw: any = mobileRegex.exec(body) ?.[1] || '{}'
      const data: any = JSON.parse(raw)
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
        channels.push({
          name:                  item.correctedQuery.runs[0].text,
          channel_id:            'didyoumean',
          nb_videos:             '0',
          nb_subscriber:         '0',
          official:              false,
          channel_avatar_small:  '',
          channel_avatar_medium: '',
        })
        channels[i]
      }
    }
    return {
      channels: channels,
      token: token,
    }
  } catch(e) {
    console.log('search channel error, terms: '+terms, e)
  }
}

async function getChannelVideos(id: string, published_after?: Date) {
  try {
    const body: any = (await axios.get('https://m.youtube.com/channel/'+encodeURI(id)+'/videos', headers)).data as string
    const raw: any = mobileRegex.exec(body) ?.[1] || '{}'
    const data: any = JSON.parse(raw)
    const items: any = data.contents.singleColumnBrowseResultsRenderer?.tabs[1]?.tabRenderer?.content?.sectionListRenderer?.contents[0]?.itemSectionRenderer
    let token: string = items.continuations?.[0]?.nextContinuationData?.continuation || ''
    let videos: any = []
    for(let i = 0; i < items.contents.length; i++) {
      let video = await formatVideo(items.contents[i])
      if(!published_after) {
        videos.push(video)
      }
      else if(moment(video.publishedAt).isAfter(published_after) && published_after) {
        videos.push(video)
      }
      else {
        return videos
      }
    }
    while(token !== '') {
      try {
        wait(Math.floor(Math.random() * 300))
        let data = (await axios.get('https://youtube.com/browse_ajax?ctoken='+token, headersAJAX)).data
        let newVideos: any = data[1]?.response?.continuationContents?.gridContinuation?.items || ''
        token = data[1].response.continuationContents?.gridContinuation?.continuations?.[0]?.nextContinuationData?.continuation || ''
        for(let i = 0; i < newVideos.length; i++) {
          let video = await formatVideo(newVideos[i])
          if(moment(video.publishedAt).isBefore(published_after) && published_after) {
            return videos
          }
          else {
            videos.push(video)
          }
        }
      } catch(e) {
        console.log(e)
        token = ''
      }
    }
    return videos
  } catch(e) {
    console.log('channel videos error for id: '+id, e)
  }
}

async function formatVideo(video: any, speedDate?: boolean) {
  try{
    if(video.compactVideoRenderer || video.gridVideoRenderer) {
      video = video.compactVideoRenderer ? video.compactVideoRenderer : video.gridVideoRenderer
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
    console.log(e)
  }
}
