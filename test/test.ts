import axios, { AxiosRequestConfig } from 'axios'

const headers: AxiosRequestConfig = {headers: {
  'Access-Control-Allow-Origin' : '*',
  'x-youtube-client-name': 1,
  'x-youtube-client-version': '2.20200911.04.00',
  'User-Agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Mobile Safari/537.36',
}}
const mobileRegex  = /id\=\"initial\-data\"\>\<\!\-\-\ (.*)\ \-\-\>\<\/div\>\<script\ \>if/

async function test() {
  const id = 'UCcdNy_FqMi0z1VU6kanOvFQ'
  const body: any = (await axios.get('https://m.youtube.com/channel/'+encodeURI(id)+'/videos', headers)).data as string
  const raw: any = mobileRegex.exec(body) ?.[1] || '{}'
  const data: any = JSON.parse(raw)
  const items: any = data.contents?.singleColumnBrowseResultsRenderer?.tabs[1]?.tabRenderer?.content?.sectionListRenderer?.contents[0]?.itemSectionRenderer
  let token: string = items.continuations?.[0]?.nextContinuationData?.continuation || ''
  let videos: any = []
  console.log(items.contents)
}

test()