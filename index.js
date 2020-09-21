import axios, { AxiosRequestConfig } from 'axios'
import * as moment from 'moment'

const headers = {headers: {
  'x-youtube-client-name': 1,
  'x-youtube-client-version': '2.20200911.04.00',
  'User-Agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Mobile Safari/537.36',
}}

const headersAJAX = {headers: {
  'User-Agent': 'hellobiczes',
  'x-youtube-client-name': 1,
  'x-youtube-client-version': '2.20200731.02.01'
}}

const videoRegex = /ytInitialPlayerConfig\ \=\ (.*)\;\n\ \ \ \ \ \ setTimeout/
const mobileRegex  = /id\=\"initial\-data\"\>\<\!\-\-\ (.*)\ \-\-\>\<\/div\>\<script\ \>if/

exports.searchVideo = async function searchVideo(terms, full_date) {
  try {
    let items = []
    let videos = []
    // initial videos search
    if(!token) {
      let body = (await axios.get('https://m.youtube.com/results?sp=EgIQAQ%253D%253D&videoEmbeddable=true&search_query='+terms, headers)).data
      let raw = mobileRegex.exec(body) ?.[1] || '{}'
      let datas = JSON.parse(raw).contents.sectionListRenderer
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

exports.searchChannel = async function searchChannel(terms) {
  try {
    let items = []
    let channels = []
    if(!token) {
      const body = (await axios.get('https://m.youtube.com/results?sp=CAASAhAC&search_query='+encodeURI(terms), headers)).data
      const raw = mobileRegex.exec(body) ?.[1] || '{}'
      const data = JSON.parse(raw)
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
        channels.push({
          name:                  item.title.runs[0].text,
          channel_id:            item.channelId,
          nb_videos:             item.videoCountText?.runs[0].text.replace(/[^0-9k]/g, '').replace('k', '000') || 0,
          nb_subscriber:         item.subscriberCountText?.runs[0].text.replace(/[^0-9k]/g, '').replace('k', '000') || 0,
          official:              (item.ownerBadges ? true : false),
          channel_avatar_small:  avatarSmall,
          channel_avatar_medium: avatarBig,
        })
      }
      else if(items[i].didYouMeanRenderer || items[i].showingResultsForRenderer) {
        let item
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

exports.getChannelVideos = async function getChannelVideos(id, published_after) {
  try {
    const body = (await axios.get('https://m.youtube.com/channel/'+encodeURI(id)+'/videos', headers)).data
    const raw = mobileRegex.exec(body) ?.[1] || '{}'
    const data = JSON.parse(raw)
    const items = data.contents.singleColumnBrowseResultsRenderer?.tabs[1]?.tabRenderer?.content?.sectionListRenderer?.contents[0]?.itemSectionRenderer
    let token = items.continuations?.[0]?.nextContinuationData?.continuation || ''
    let videos = []
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
        wait(Math.floor(Math.random() * 500))
        let data = (await axios.get('https://youtube.com/browse_ajax?ctoken='+token, headersAJAX)).data
        let newVideos = data[1]?.response?.continuationContents?.gridContinuation?.items || ''
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

async function formatVideo(video, full_date) {
  try{
    if(video.compactVideoRenderer || video.gridVideoRenderer) {
      video = video.compactVideoRenderer ? video.compactVideoRenderer : video.gridVideoRenderer
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
      video.title = cleanTitle(video.title)

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
      let publishedAt = !full_date ? await getVideoDate(id) : video.publishedTimeText?.runs[0].text || ''
      return {
        id:  id,
        original_title: video.original_title,
        title:	video.title,
        artist: video.artist,
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

exports.getVideoDate = async function getVideoDate(id) {
  try {
    const body = (await axios.get('https://m.youtube.com/watch?v='+id, headers)).data
    const raw = videoRegex.exec(body) ?.[1] || '{}'
    const datas = JSON.parse(raw)
    let publishText = JSON.parse(datas.args.player_response).microformat?.playerMicroformatRenderer?.publishDate
    publishText += ' '+Math.floor(Math.random() * 24)+'-'+Math.floor(Math.random() * 60)+'-'+Math.floor(Math.random() * 60)
    return Promise.resolve(moment(publishText, 'YYYY-MM-DD H-m-s').toDate())
  } catch(e) {
    console.log('get date error for '+id+', try again', e)
    getVideoDate(id)
  }
}

exports.getChannelDesc = async function getChannelDesc(id) {
  try {
    const body = (await axios.get('https://m.youtube.com/channel/'+encodeURI(id)+'/videos', headers)).data
    const raw = mobileRegex.exec(body) ?.[1] || '{}'
    const data = JSON.parse(raw)
    let description = data.metadata?.channelMetadataRenderer?.description || ''
    return description
  } catch(e) {
    console.log('channel desc error for '+id, e)
  }
}

function cleanTitle(title) {
  const braketsRegex = /\[[^)]*\]/
  let forbidenTerms = ['(full album)', '(official ep)', '(official video)', '(radio edit)',]
  let regex = /n/
  title = title.replace(braketsRegex, '')
  forbidenTerms.forEach(forbidenTerm => {
    title = title.replace(new RegExp(forbidenTerm, 'ig'), '')
    title = title.replace('()', '')
  })
  return title
}

function wait(ms){
  var start = new Date().getTime();
  var end = start;
  while(end < start + ms) {
    end = new Date().getTime();
  }
}

// module.exports = {log, shout, whisper}
// const { log, shout, whisper } = require('my-module-name')