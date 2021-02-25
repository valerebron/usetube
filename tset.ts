import nodeFetch from './src/helpers/fetch'

let headers =  {
  'Access-Control-Allow-Origin' : '*',
  'User-Agent': 'hellobiczes',
  'x-youtube-client-name': 1,
  'x-youtube-client-version': '2.20200731.02.01',
  'Authorization': '4qmFsgKBARIYVUMwRVhabTdXN0Y3cHgycmNxZWN5QzZ3GjZFZ1oyYVdSbGIzTVlBeUFBTUFFNEFlb0RFME5uUVZORFoybGxPVnBtZDNOeGJXRTNkMmMlM0SaAixicm93c2UtZmVlZFVDMEVYWm03VzdGN3B4MnJjcWVjeUM2d3ZpZGVvczEwMg%3D%3D'
}

let urlstring = 'https://www.youtube.com/youtubei/v1/browse?key=4qmFsgKBARIYVUMwRVhabTdXN0Y3cHgycmNxZWN5QzZ3GjZFZ1oyYVdSbGIzTVlBeUFBTUFFNEFlb0RFME5uUVZORFoybGxPVnBtZDNOeGJXRTNkMmMlM0SaAixicm93c2UtZmVlZFVDMEVYWm03VzdGN3B4MnJjcWVjeUM2d3ZpZGVvczEwMg%3D%3D'

async function t() {
  let body = await nodeFetch(urlstring, {
    mode: 'no-cors',
    headers: headers
  })
  
  let fs = require('fs'); fs.writeFile('raw.json', body, (e)=>{console.log(e)})
}

t()
