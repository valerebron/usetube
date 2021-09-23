import Video from './types/video'
import getData from './helpers/getData'
import formatVideo from './helpers/formatVideo'
import findVal from './helpers/findVal'

export default async function searchVideo(terms: string, token?: string, apikey?: string) {
  try {
    let items: any = []
    let videos: Video[] = []
    let didyoumean: string = ''
    // initial videos search
    if (!token) {
      let data = await getData('https://m.youtube.com/results?videoEmbeddable=true&search_query='+encodeURI(terms))
      apikey = data.apikey
      token = findVal(data, 'token')
      items = findVal(data, 'itemSectionRenderer').contents
    }
    // more videos
    else {
      let data = await getData('https://www.youtube.com/youtubei/v1/search?key='+apikey+'&token='+token)
      items = findVal(data.items, 'contents')
      token = data.token
    }
    for(let i = 0; i < items.length; i++) {
      let formated: Video = await formatVideo(items[i], true)
      if (formated) {
        if (formated.id === 'didyoumean') {
          didyoumean = formated.title
        }
        else {
          videos.push(formated)
        }
      }
    }
    return {
      videos: videos,
      didyoumean: didyoumean,
      token: token,
      apikey: apikey,
    }
  } catch(e) {
    console.log('search videos error, terms: '+terms)
    // console.log(e)
  }
}
