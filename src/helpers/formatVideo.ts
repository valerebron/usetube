import getVideoDate from '../getVideoDate'
import getDateFromText from './getDateFromText'
import findVal from './findVal'

export default async function formatVideo(video: any, speedDate: boolean = false) {
  try {
    const data = video.videoWithContextRenderer
    let id = data?.videoId || null
    let title = data?.headline?.runs[0]?.text || ""
    let original_title = title
    let artist = data?.shortBylineText?.runs[0]?.text || ""
    let durationDatas = data?.lengthText?.runs[0]?.text || ""
     //TODO: find a way to get publishedAT

      durationDatas.split(':')
      let hour: number = durationDatas[0] * 60 * 60 || 0
      let minute: number = durationDatas[1] * 60 || 0
      let second: number = durationDatas[2] || 0
    // let title 
    // console.log(original_title)

      return {
        id: id,
        original_title: original_title.trim(),
        title: title.trim(),
        artist: artist.trim(),
        duration: hour + minute + second,
        publishedAt: new Date(),
      }
  } catch (e) {
    console.log('format video failed')
  }
}


