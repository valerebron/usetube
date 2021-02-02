import getVideoDate from '../getVideoDate'
import getDateFromText from './getDateFromText'

export default async function formatVideo(video: any, speedDate: boolean = false) {
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
      let publishedAt: Date = speedDate ? getDateFromText(video.publishedTimeText?.runs[0].text || '') : await getVideoDate(id)
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
