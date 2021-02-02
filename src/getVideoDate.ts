import getData from './helpers/getData'

export default async function getVideoDate(id: string) {
  try {
    let publishText: string = await getData('https://m.youtube.com/watch?v='+id+'&type=date')
    publishText.replace('-', '/')
    publishText += ' '+Math.floor(Math.random() * 24)+':'+Math.floor(Math.random() * 60)+':'+Math.floor(Math.random() * 60)
    return new Date(Date.parse(publishText))
  } catch(e) {
    console.log('cannot get date for '+id+', try again')
    // console.log(e)
  }
}
