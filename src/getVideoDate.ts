import { Client } from 'youtubei'
import * as dayjs from 'dayjs'

export default async function getVideoDate(id: string) {
  try {
    const youtube = new Client()
    const data = await youtube.getVideo(id)
    let stringDate = data.uploadDate.replace(/^\D+/,'')
    stringDate = stringDate.replace('janv.', 'jan').replace('févr.', 'feb').replace('mars', 'mar').replace('avr.', 'apr').replace('mai', 'may').replace('juin', 'jun').replace('juil.','jul').replace('août','aug').replace('déc.','dec')
    const finalDate = dayjs(stringDate).toDate()
    return finalDate
  } catch(e) {
    console.log('cannot get date for '+id+', try again')
    // console.log(e)
  }
}
