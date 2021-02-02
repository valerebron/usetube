import getData from './helpers/getData'

export default async function getVideoDesc(id: string) {
  try {
    const data: any = await getData('https://m.youtube.com/watch?v='+id)
    let description: string = data.contents?.singleColumnWatchNextResults?.results?.results?.contents[1]?.itemSectionRenderer?.contents[0]?.slimVideoMetadataRenderer?.description?.runs || ''
    return description
  } catch(e) {
    console.log('video desc error for '+id)
    // console.log(e)
  }
}
