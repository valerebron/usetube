import Video from './types/video'
import getData from './helpers/getData'
import formatVideo from './helpers/formatVideo'
import findVal from './helpers/findVal'

export default async function getChannelVideos(id: string, published_after?: Date) {
  try {
    const data: any = await getData('https://m.youtube.com/channel/'+id+'/videos')
    const apikey = data.apikey
    const channel: any = findVal(data, 'itemSectionRenderer').contents
    let token: string = findVal(data, 'token')
    let videos: Video[] = []
    for(let i = 0; i < channel.length; i++) {
      let video: Video = await formatVideo(channel[i], false)
      if (video && video.publishedAt) {
        if ((published_after && video.publishedAt.getTime() > published_after.getTime())  || !published_after) {
          videos.push(video)
        }
      }
    }
    while(token) {
      try {
        let data = await getData('https://www.youtube.com/youtubei/v1/browse?key='+apikey+'&token='+token)
        let newVideos: any = data.items
        token = data.token
        for(let i = 0; i < newVideos.length; i++) {
          let video: Video = await formatVideo(newVideos[i], false)
          if (video) {
            if (published_after) {
              if (video.publishedAt.getTime() > published_after.getTime()) {
                videos.push(video)
              } else {
                token = ''
              }
            }
            else {
              videos.push(video)
            }
          }
        }
      } catch(e) {
        console.log('getChannelVideos failed')
        token = ''
      }
    }
    return videos
  } catch(e) {
    console.log('cannot get channel videos for id: '+id+', try again')
    // console.log(e)
  }
}
