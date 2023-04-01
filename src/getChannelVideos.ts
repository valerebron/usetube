import Video from './types/video'
import { Client } from 'youtubei'
import formatVideo from './helpers/formatVideo'

export default async function getChannelVideos(id: string, published_after?: Date) {
  try {
    const youtube = new Client()
    const data = await youtube.getChannel(id)
    const channelsVideos = await data.videos.next()
    const apikey: String = ''
    let token: string
    let videos: Video[]
    for(let i = 0; i < channelsVideos.length; i++) {
      let video: Video = await formatVideo(channelsVideos[i], false)
      if (video && video.publishedAt) {
        if ((published_after && video.publishedAt.getTime() > published_after.getTime())  || !published_after) {
          videos.push(video)
        }
      }
    }

    return videos
  } catch(e) {
    console.log('cannot get channel videos for id: '+id+', try again')
    console.log(e)
  }
}
