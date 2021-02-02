import Channel from './types/channel'
import getData from './helpers/getData'
import formatYoutubeCount from './helpers/formatYoutubeCount'

export default async function searchChannel(terms: string, token?: string) {
  try {
    let items: any = []
    let channels: Channel[] = []
    let didyoumean: string = ''
    if(!token) {
      const data = await getData('https://m.youtube.com/results?sp=CAASAhAC&search_query='+encodeURI(terms))
      items = data.contents.sectionListRenderer?.contents[0]?.itemSectionRenderer?.contents  
      token = data.continuations?.[0]?.reloadContinuationData?.continuation || ''
    }
    else {
      let data = await getData('https://youtube.com/browse_ajax?ctoken='+token)
      items = data.items || ''
      token = data.continuations?.[0]?.nextContinuationData?.continuation || ''
    }
    for(let i = 0; i < items.length; i++) {
      if(items[i].compactChannelRenderer) {
        const item = items[i].compactChannelRenderer
        let avatarSmall = item.thumbnail?.thumbnails[0].url || ''
        let avatarBig   = item.thumbnail?.thumbnails[1].url || ''
        avatarSmall = (avatarSmall.startsWith('//') ? 'https:'+avatarSmall : avatarSmall)
        avatarBig = (avatarBig.startsWith('//') ? 'https:'+avatarBig : avatarBig)
        
        const nbSubscriber: number = formatYoutubeCount(item.subscriberCountText?.runs[0].text)
        const nbVideo: number = formatYoutubeCount(item.videoCountText?.runs[0].text)

        channels.push({
          name:                  item.title.runs[0].text,
          channel_id:            item.channelId,
          nb_videos:             nbVideo,
          nb_subscriber:         nbSubscriber,
          official:              (item.ownerBadges ? true : false),
          channel_avatar_small:  avatarSmall,
          channel_avatar_medium: avatarBig,
        })
      }
      else if(items[i].didYouMeanRenderer || items[i].showingResultsForRenderer) {
        let item: any
        if(items[i].didYouMeanRenderer) {
          item = items[i].didYouMeanRenderer
        }
        else {
          item = items[i].showingResultsForRenderer
        }
        didyoumean = item.correctedQuery.runs[0].text
      }
    }
    return {
      channels: channels,
      didyoumean: didyoumean,
      token: token,
    }
  } catch(e) {
    console.log('search channel error, terms: '+terms)
    console.log(e)
  }
}
