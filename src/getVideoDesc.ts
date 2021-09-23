import getData from './helpers/getData'
import findVal from './helpers/findVal'

export default async function getVideoDesc(id: string) {
  try {
    const data: any = await getData('https://m.youtube.com/watch?v=' + id)
    let description: string = findVal(data, 'descriptionBodyText').runs || ''
    return description
  } catch(e) {
    console.log('video desc error for '+id)
    console.log(e)
  }
}
