import Channel from './types/channel'
import { Client } from 'youtubei'
import formatYoutubeCount from './helpers/formatYoutubeCount'

export default async function searchChannel(terms: string, token?: string, apikey?: string) {
  try {
    const youtube = new Client()
    const data = await youtube.search(terms, { type: 'channel' })

    let items: any = []
    let channels: Channel[] = []
    let didyoumean: string = ''
    if (!token) {
      apikey = ''
      token = ''
      items = data.items
    }
    else {
      console.log('wip')
    }
    items.map(item => {
      const avatarId = item.thumbnails[0].url.replace('//yt3.ggpht.com/', '')
      const nbSubscriber: number = formatYoutubeCount(item.subscriberCount || '0')
      channels.push({
        name:                  item.name,
        channel_id:            item.subscriberCount,
        nb_videos:             item.videoCount,
        nb_subscriber:         nbSubscriber,
        official:              false,
        channel_avatar_small:  'https://yt3.ggpht.com/'+avatarId.replace('=s88','=s80'),
        channel_avatar_medium: 'https://yt3.ggpht.com/'+avatarId.replace('=s88','=s200'),
        channel_avatar_large: 'https://yt3.ggpht.com/'+avatarId.replace('=s88','=s800'),
      })
    })
    return {
      channels: channels,
      didyoumean: didyoumean,
      token: token,
      apikey: apikey,
    }
  } catch(e) {
    console.log('search channel error, terms: '+terms)
    // console.log(e)
  }
}
