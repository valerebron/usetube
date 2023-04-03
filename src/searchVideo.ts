import Video from './types/video'
import { Client } from 'youtubei'
import formatVideo from './helpers/formatVideo'
import { CancelToken } from 'axios'

export default async function searchVideo(terms: string, token?: number, apikey?: string) {
  try {
    const youtube = new Client()
    const data = await youtube.search(terms, { type: 'video' })

    let items: any = []
    let videos: Video[] = []
    let didyoumean: string = ''

    for(let i = 0; i < token; i++  ) {
      data.next()
    }

    items = data.items

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
