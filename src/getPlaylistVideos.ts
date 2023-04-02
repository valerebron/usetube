import Video from './types/video'
import { Client } from 'youtubei'
import formatVideo from './helpers/formatVideo'

export default async function getPlaylistVideos(id: string, speedDate?: boolean) {
  try {
    const youtube = new Client()
    const data = await youtube.findOne(id, {type: 'playlist'})
    const items = data
    return data
    // const apikey = ''
    // let token: string = ''
    // let videos: Video[] = []
    // for(let i = 0; i < items.length; i++) {
    //   if (items[i]) {
    //     const formated = await formatVideo(items[i], speedDate)
    //     if (formated) {
    //       videos.push(formated)
    //     }
    //   }
    // }
    // while(token) {
    //   try {
    //     console.log('wip')
    //   } catch(e) {
    //     console.log('getPlaylistVideos failed')
    //     // console.log(e)
    //     token = ''
    //   }
    // }
    // return videos
  } catch(e) {
    console.log('cannot get playlist '+id+', try again')
    // console.log(e)
  }
}
