import nodeFetch from './fetch'
import decodeHex from './decodeHex'

export default async function getData(urlstring: string) {
  const dataRegex  = /var\ ytInitialData\ \=\ \'(.*)\'\;<\/script>/
  const dateRegex  = /publishDate":"(.*)","ownerChannelName/
  let url = new URL(urlstring)
  let isAjax = false
  let isDate = false
  let body
  if(url.searchParams.get('ctoken')) {
    isAjax = true
  }
  if(url.searchParams.get('type') === 'date') {
    isDate = true
  }
  let headers: any
  if(isAjax) {
    headers =  {
      'Access-Control-Allow-Origin' : '*',
      'User-Agent': 'hellobiczes',
      'x-youtube-client-name': 1,
      'x-youtube-client-version': '2.20200731.02.01'
    }
  }
  else {
    headers = {
      'Access-Control-Allow-Origin' : '*',
      'x-youtube-client-name': 1,
      'x-youtube-client-version': '2.20200911.04.00',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Mobile Safari/537.36',
    }
  }
  if(typeof window === 'undefined') { // node
      body = await nodeFetch(urlstring, {
      mode: 'no-cors',
      headers: headers
    })
  }
  else { // browser
    try {
      body = await fetch(urlstring, {
        mode: 'no-cors',
        headers: headers,
      })
      body = await body.text()
    }
    catch(e) {
      console.log(e)
    }
  }
  if(isAjax) {
    // let fs = require('fs'); fs.writeFile('raw.json', body, (e)=>{console.log(e)})
    let json = JSON.parse(body)
    const ajaxData = json[1].response.continuationContents?.gridContinuation
    return { items: ajaxData.items, token: ajaxData.continuations?.[0]?.nextContinuationData?.continuation || ''}
  }
  else {
    if(isDate) {
      const raw = dateRegex.exec(body) ?.[1] || '{}'
      return raw
    }
    else {
      const raw = dataRegex.exec(body) ?.[1] || '{}'
      // let fs = require('fs'); fs.writeFile('raw.json', decodeHex(raw), (e)=>{console.log(e)})
      return JSON.parse(decodeHex(raw))
    }
  }
}
