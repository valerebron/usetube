import Video from './types/video'
import getData from './helpers/getData'
import formatVideo from './helpers/formatVideo'
import wait from './helpers/wait'

export default async function getChannelVideos(id: string, published_after?: Date) {
  try {
    const data: any = await getData('https://m.youtube.com/channel/'+id+'/videos')
    const channel: any = data.contents?.singleColumnBrowseResultsRenderer?.tabs[1]?.tabRenderer?.content?.sectionListRenderer?.contents[0]?.itemSectionRenderer
    let token: string = channel.continuations?.[0]?.nextContinuationData?.continuation || ''
    let videos: Video[] = []
    for(let i = 0; i < channel.contents.length; i++) {
      let video: Video = await formatVideo(channel.contents[i], false)
      if((published_after && video.publishedAt.getTime() > published_after.getTime())  || !published_after) {
        videos.push(video)
      }
      else {
        return videos
      }
    }
    while(token !== '') {
      try {
        wait()
        let data = await getData('https://youtube.com/browse_ajax?ctoken='+token)
        let newVideos: any = data.items
        token = data.token
        for(let i = 0; i < newVideos.length; i++) {
          let video: Video = await formatVideo(newVideos[i], false)
          if(published_after) {
            if(video.publishedAt.getTime() > published_after.getTime()) {
              videos.push(video)
            }
          }
          else {
            return videos
          }
        }
      } catch(e) {
        console.log('getChannelVideos failed')
        // console.log(e)
        token = ''
      }
    }
    return videos
  } catch(e) {
    console.log('cannot get channel videos for id: '+id+', try again')
    // console.log(e)
  }
}
