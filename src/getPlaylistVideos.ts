import Video from './types/video'
import getData from './helpers/getData'
import wait from './helpers/wait'
import formatVideo from './helpers/formatVideo'

export default async function getPlaylistVideos(id: string, speedDate?: boolean) {
  try {
    const data: any = await getData('https://m.youtube.com/playlist?list='+id)
    const items: any = data.contents?.singleColumnBrowseResultsRenderer?.tabs[0]?.tabRenderer?.content?.sectionListRenderer?.contents[0]?.itemSectionRenderer?.contents[0]?.playlistVideoListRenderer || ''
    let token: string = items.continuations[0]?.nextContinuationData.continuation || ''
    let videos: Video[] = []
    for(let i = 0; i < items.contents.length; i++) {
      videos.push(await formatVideo(items.contents[i], speedDate))
    }
    while(token !== '') {
      try {
        wait()
        let nextData: any = await getData('https://m.youtube.com/playlist?ctoken='+token)
        let nextVideos: any = nextData.continuationContents.playlistVideoListContinuation.contents
        if(nextData.continuations) {
          token = nextData.continuations[0]?.nextContinuationData.continuation
        }
        else {
          token = ''
        }
        for(let i = 0; i < nextVideos.length; i++) {
          videos.push(await formatVideo(nextVideos[i], speedDate))
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
