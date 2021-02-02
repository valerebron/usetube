import getData from './helpers/getData'

export default async function getChannelDesc(id: string) {
  try {
    const data: any = await getData('https://m.youtube.com/channel/'+id+'/videos')
    let description: string = data.metadata?.channelMetadataRenderer?.description || ''
    return description
  } catch(e) {
    console.log('channel desc error for '+id)
    // console.log(e)
  }
}
