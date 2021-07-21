import getVideoDate from '../getVideoDate'
import getDateFromText from './getDateFromText'
import findVal from './findVal'

export default async function formatVideo(video: any, speedDate: boolean = false) {
  try {
    if (video.compactVideoRenderer || video.gridVideoRenderer || video.videoRenderer || video.playlistVideoRenderer) {
      if (video.compactVideoRenderer) {
        video = video.compactVideoRenderer
      }
      else if (video.gridVideoRenderer) {
        video = video.gridVideoRenderer
      }
      else if (video.playlistVideoRenderer) {
        video = video.playlistVideoRenderer
      }
      else if (video.videoRenderer) {
        video = video.videoRenderer
      }
      let id: string = video.videoId
      let durationDatas: any = 0
      // get title
      if (video.title.simpleText) {
        video.title = video.title.simpleText
      }
      else if (video.title.runs[0].text) {
        video.title = video.title.runs[0].text
      }
      else {
        video.title = ''
      }
      // title formating
      video.original_title = video.title

      if (video.title.split('-').length === 1) {
        video.artist = ''
      }
      else {
        let splited = video.original_title.match(/([^,]*)-(.*)/)
        video.artist = splited[1]
        video.title = splited[2]
      }
      // duration formating
      if (video.lengthText) {
        if (durationDatas === undefined) {
          findVal(video.lengthText, 'simpleText')
        }
        else {
          durationDatas = findVal(video.lengthText, 'text')
        }
        if (durationDatas) {
          durationDatas = durationDatas.split(':')
        }
      }
      else if (video.thumbnailOverlays) {
        durationDatas = findVal(video, 'lengthText')
        if (durationDatas) {
          durationDatas = durationDatas.split(':')
        }
      }

      let hour: number = 0
      let minute: number = 0
      let second: number = 0
      if (durationDatas) {
        switch (durationDatas.length) {
          case 3:
            hour = parseInt(durationDatas[0]) * 60 * 60
            minute = parseInt(durationDatas[1]) * 60
            second = parseInt(durationDatas[2])
            break
          case 2:
            minute = parseInt(durationDatas[0]) * 60
            second = parseInt(durationDatas[1])
            break
          case 1:
            second = parseInt(durationDatas[0])
            break
        }
      }
      // Date formating
      let publishedAt: Date = new Date(Date.now())
      if (speedDate && video.publishedTimeText) {
        if (video.publishedTimeText.hasOwnProperty('simpleText')) {
          publishedAt = getDateFromText(video.publishedTimeText.simpleText)
        }
        else if (video.publishedTimeText.hasOwnProperty('runs')) {
          publishedAt = getDateFromText(video.publishedTimeText.runs[0].text)
        }
      }
      else {
        publishedAt = await getVideoDate(id)
      }
      

      return {
        id: id,
        original_title: video.original_title.trim(),
        title: video.title.trim(),
        artist: video.artist.trim(),
        duration: hour + minute + second,
        publishedAt: publishedAt,
      }
    }
    else if (video.didYouMeanRenderer || video.showingResultsForRenderer) {
      video = video.didYouMeanRenderer ? video.didYouMeanRenderer : video.showingResultsForRenderer
      return {
        id: 'didyoumean',
        original_title: '',
        title: video.correctedQuery?.runs[0].text || '',
        artist: '',
        duration: 0,
        publishedAt: new Date(Date.now()),
        views: 0,
      }
    }
  } catch (e) {
    console.log('format video failed')
    // console.log(e)
  }
}
