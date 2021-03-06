export default function nodeFetch(url, options) {
  try {
    if(typeof window === 'undefined') {
      return new Promise((resolve, reject) => {
        const lib = url.startsWith('https') ? require('https') : require('http')
        const request = lib.get(url, options, (response) => {
          if (response.statusCode < 200 || response.statusCode > 299) {
            reject(new Error('Failed to load page, status code: ' + response.statusCode))
          }
          const body = []
          response.on('data', (chunk) => body.push(chunk))
          response.on('end', () => resolve(body.join('')))
        })
        request.on('error', (err) => reject(err))
      })
    }
  }
  catch(e) {
    console.log(e)
  }
}
