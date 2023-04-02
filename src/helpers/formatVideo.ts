import getVideoDate from '../getVideoDate'
import getDateFromText from './getDateFromText'

export default async function formatVideo(video: any, speedDate: boolean = false) {
  try {
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
    // Date formating
    let publishedAt: Date = new Date(Date.now())
    if (speedDate) {
      publishedAt = getDateFromText(video.uploadDate)
    }
    else {
      publishedAt = await getVideoDate(video.id)
    }
    return {
      id: video.id,
      original_title: video.original_title.trim(),
      title: video.title.trim(),
      artist: video.artist.trim(),
      duration: video.duration,
      publishedAt: publishedAt,
    }
  } catch (e) {
    console.log('format video failed')
    console.log(e)
  }
}
