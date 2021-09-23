import Channel from './types/channel'
import getData from './helpers/getData'
import formatYoutubeCount from './helpers/formatYoutubeCount'
import findVal from './helpers/findVal'

export default async function searchChannel(terms: string, token?: string, apikey?: string) {
  try {
    let items: any = []
    let channels: Channel[] = []
    let didyoumean: string = ''
    if (!token) {
      const data = await getData('https://m.youtube.com/results?sp=EgIQAg%253D%253D&search_query='+encodeURI(terms))
      apikey = data.apikey
      token = findVal(data, 'token')
      items = findVal(data, 'itemSectionRenderer').contents
    }
    else {
      let data = await getData('https://www.youtube.com/youtubei/v1/search?key='+apikey+'&token='+token)
      items = findVal(data.items, 'contents')
      token = data.token
    }
    for(let i = 0; i < items.length; i++) {
      if (items[i].compactChannelRenderer || items[i].channelRenderer) {
        const item = (items[i].compactChannelRenderer) ? items[i].compactChannelRenderer : items[i].channelRenderer
        item.name = (items[i].compactChannelRenderer) ? item.title.runs[0].text : item.title.simpleText
        let avatar = item.thumbnail?.thumbnails[0].url || ''
        let avatarId = avatar.substring(avatar.lastIndexOf('ytc/')+4, avatar.lastIndexOf('=s'))
        const nbSubscriber: number = formatYoutubeCount(item.subscriberCountText?.accessibility.accessibilityData.label || '0')
        const nbVideo: number = formatYoutubeCount(item.videoCountText?.runs[0]?.text || '0')
        channels.push({
          name:                  item.name,
          channel_id:            item.channelId,
          nb_videos:             nbVideo,
          nb_subscriber:         nbSubscriber,
          official:              (item.ownerBadges ? true : false),
          channel_avatar_small:  'https://yt3.ggpht.com/ytc/'+avatarId+'=s80',
          channel_avatar_medium: 'https://yt3.ggpht.com/ytc/'+avatarId+'=s200',
          channel_avatar_large: 'https://yt3.ggpht.com/ytc/'+avatarId+'=s800',
        })
      }
      else if (items[i].didYouMeanRenderer || items[i].showingResultsForRenderer) {
        let item: any
        if (items[i].didYouMeanRenderer) {
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
      apikey: apikey,
    }
  } catch(e) {
    console.log('search channel error, terms: '+terms)
    // console.log(e)
  }
}
