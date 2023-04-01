import { Client } from 'youtubei'
import * as dayjs from 'dayjs'

export default async function getVideoDate(id: string) {
  try {
    const youtube = new Client()
    const data = await youtube.getVideo(id)
    return dayjs(data.uploadDate).toDate()
  } catch(e) {
    console.log('cannot get date for '+id+', try again')
    // console.log(e)
  }
}
