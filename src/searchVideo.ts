import Video from './types/video'
import { Client } from 'youtubei'
import formatVideo from './helpers/formatVideo'

export default async function searchVideo(terms: string, token?: string, apikey?: string) {
  try {
    const youtube = new Client()
    const data = await youtube.search(terms, { type: 'video' })

    let items: any = []
    let videos: Video[] = []
    let didyoumean: string = ''
    // initial videos search
    if (!token) {
      terms
      apikey = ''
      token = ''
      items = data.items
    }
    // more videos
    else {
      console.log('wip')
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
      token: apikey,
      apikey: apikey,
    }
  } catch(e) {
    console.log('search videos error, terms: '+terms)
    // console.log(e)
  }
}
