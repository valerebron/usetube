import Video from './types/video'
import SearchResult from './types/searchResult'
import cleanTitle from './helpers/cleanTitle'
import getVideoDesc from './getVideoDesc'
import getVideoDate from './getVideoDate'
import searchVideo from './searchVideo'

export default async function getVideosFromDesc(yt_id) {
  try {
    let videos: Video[] = []
    let desc: any = await getVideoDesc(yt_id)
    if(desc) {
      let trackList = desc.pop().text.split('\n').filter(Boolean)
      trackList = trackList.filter(title => !title.includes('00:00'))
      trackList = trackList.filter(title => !title.startsWith(' '))
      if(trackList.length !== 0) {
        loop1:
        for(let i = 0; i < trackList.length; i++) {
          let elt = cleanTitle(trackList[i]).replace(/[0-9]?[0-9]?:[0-9]?[0-9]?/,'')
          if(!elt || !elt.includes('-')) {
            break loop1
          }
          let title = elt.split('-')[1].trim()
          let artist = elt.split('-')[0].trim() 
          let videosSearched: SearchResult = await searchVideo(title+' '+artist)
          loop2:
          for(let y = 0; y < videosSearched.videos.length; y++) {
            let track = videosSearched.videos[y]
            let original_title_lower = track.original_title.toLowerCase()
            if(original_title_lower.includes(artist.split(' ')[0].toLowerCase()) && original_title_lower.includes(title.split(' ')[0].toLowerCase())) {
              track.publishedAt = await getVideoDate(track.id)
              track.title = title
              track.artist = artist
              videos.push(track)
              break loop2
            }
            else {
              continue loop2
            }
          }
        }
      }
    }
    return videos
  } catch(e) {
    console.log('getVideosFromDesc error, maybe captcha to resolve')
    // console.log(e)
  }
}
