import Video from './types/video'
import getData from './helpers/getData'
import findVal from './helpers/findVal'
import formatVideo from './helpers/formatVideo'

export default async function getPlaylistVideos(id: string, speedDate?: boolean) {
  try {
    const data: any = await getData('https://m.youtube.com/playlist?list='+id)
    const apikey = data.apikey
    const items: any = findVal(data, 'playlistVideoListRenderer').contents
    let token: string = findVal(data, 'token')
    let videos: Video[] = []
    for(let i = 0; i < items.length; i++) {
      if (items[i]) {
        const formated = await formatVideo(items[i], speedDate)
        if (formated) {
          videos.push(formated)
        }
      }
    }
    while(token) {
      try {
        let nextData: any = await getData('https://www.youtube.com/youtubei/v1/browse?key='+apikey+'&token='+token)
        let nextVideos: any = nextData.items
        token = nextData.token
        for(let i = 0; i < nextVideos.length; i++) {
          if (nextVideos[i]) {
            const formated = await formatVideo(nextVideos[i], speedDate)
            if (formated) {
              videos.push(formated)
            }
          }
        }
      } catch(e) {
        console.log('getPlaylistVideos failed')
        // console.log(e)
        token = ''
      }
    }
    return videos
  } catch(e) {
    console.log('cannot get playlist '+id+', try again')
    // console.log(e)
  }
}
