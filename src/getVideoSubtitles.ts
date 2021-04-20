import getData from './helpers/getData'

export default async function getVideoSubtitles(id: string) {
  try {
    const data = await getData('https://m.youtube.com/watch?v='+id+'&type=subtitles')
    return data.data.events
  } catch(e) {
    console.log('video subtitle error for '+id)
    console.log(e)
  }
}
