# **Usetube.js**
### with usetube you Crawl youtube so you can **search videos** or **channels**, you can also **grab all channel's videos** at once

### This script is **google api key free** (so you don't need google account :))

### This script is **google Quota free** (you can retrieve all videos a channel can give you :))  
<br>

# install
```shell
npm install usetube
```

# usage

```js
const usetube = require('usetube')

usetube.searchChannel('usetube is great').then(channels => { console.log(channels) })

usetube.searchVideo('use usetube').then(videos => { console.log(videos) })

usetube.getChannelVideos('PLAbeRqyTx1rIGWY13HgPyh0VF0LdoTQFp').then(videos => { console.log(videos) })

usetube.getChannelDesc('PLAbeRqyTx1rIGWY13HgPyh0VF0LdoTQFp').then(desc => { console.log(desc) })

usetube.getVideoDate('1Bix44C1EzY').then(date => { console.log(date) })
```

### notes:
- each function return a **Promise**

# types definitions
```js
searchVideo(terms: String!, token: String?): [video], didyoumean, token

searchChannel(terms: String!, token: String?): [channel], didyoumean, token

getChannelVideos(channel_id: String!, published_after: Date?): [video]

getChannelDesc(channel_id: String!): String

getVideoDate(video_id: String!): Date
```

```js
video {
  id:                    String(11),
  original_title:        String,
  title:                 String,
  artist:                String,
  duration:              Int,
  publishedAt:           Date,
}
```
```js
channel {
  name:                  String,
  channel_id:            String,
  nb_videos:             Int,
  nb_subscriber:         Int,
  official:              Boolean,
  channel_avatar_small:  String,
  channel_avatar_medium: String,
}
```
```js
didyoumean:              String, // spelling proposal
```
```js
token:                   String, // key to get more data (next/prev page result)
```
# dependencies

[Axios](https://github.com/axios/axios)

[Moment.js](https://github.com/moment/moment/)

# TODO

1. make it work for front end javascript
2. get rid of axios, try fetch
3. FIX: get date error for mszV8N3ACyk, try again TypeError: Cannot read property 'player_response' of undefined
    at /home/ricardo/massivemusic2/back/node_modules/usetube/usetube.ts:42:50
    at Generator.next (<anonymous>)
    at fulfilled (/home/ricardo/massivemusic2/back/node_modules/usetube/dist/usetube.js:5:58)
    at process._tickCallback (internal/process/next_tick.js:68:7)