import Video from './types/video'
import SearchResult from './types/searchResult'
import getData from './helpers/getData'
import formatVideo from './helpers/formatVideo'

export default async function searchVideo(terms: string, token?: string) {
  try {
    let items: any = []
    let videos: Video[] = []
    let didyoumean: string = ''
    // initial videos search
    if(!token) {
      let data = await getData('https://m.youtube.com/results?sp=EgIQAQ%253D%253D&videoEmbeddable=true&search_query='+encodeURI(terms))
      items = data.contents.sectionListRenderer.contents[0].itemSectionRenderer.contents
      token = data.continuations?.[0]?.reloadContinuationData?.continuation || ''
    }
    // more videos
    else {
      let data = await getData('https://youtube.com/browse_ajax?ctoken='+token)
      items = data[1].response.continuationContents?.gridContinuation?.items || ''
      token = data[1].response.continuationContents?.gridContinuation?.continuations?.[0]?.nextContinuationData?.continuation || ''
    }
    for(let i = 0; i < items.length; i++) {
      let formated: Video = await formatVideo(items[i], true)
      if(formated.id === 'didyoumean') {
        didyoumean = formated.title
      }
      else {
        videos.push(formated)
      }
    }
    return {
      videos: videos,
      didyoumean: didyoumean,
      token: token,
    }
  } catch(e) {
    console.log('search videos error, terms: '+terms)
    // console.log(e)
  }
}
