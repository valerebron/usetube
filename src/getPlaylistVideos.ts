import Video from './types/video'
import getData from './helpers/getData'
import findVal from './helpers/findVal'
import formatVideo from './helpers/formatVideo'

export default async function getPlaylistVideos(id: string, speedDate?: boolean) {
  try {
    if(isYoutubePlaylist(id)>-1){
      const data: any = await getData(id)                         //get data from the url itself
      id = id.substring(isYoutubePlaylist(id),id.length)        // save the ID in case you need it later if not u can just erase it
    }else{
      const data: any = await getData('https://m.youtube.com/playlist?list='+id)
    }
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

function isYoutubePlaylist(str) {                                //Detects if it is a youtube playlist url
 if (str.toLowerCase().indexOf('?list=') > -1){
   return (str.toLowerCase().indexOf('?list=')+6)                //returns the index where the playlist ID starts
 }else{ 
   if (str.toLowerCase().indexOf('&list=') > -1){
     return (str.toLowerCase().indexOf('&list=')+6)
   } else {
     return -1
   }
 
 
}
