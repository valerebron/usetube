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
- searchVideo() return **time from now** date format. If you want the javascript **Date() format**, pass ```full_date = true``` (the query will take more time for that)
- each function return a **Promise**

# types definitions
```js
searchVideo(terms: String!, full_date: Boolean?): [video]

searchChannel(terms: String!): [channel]

getChannelVideos(channel_id: String!, published_after: Date?): [video]

getChannelDesc(channel_id: String!): String

getVideoDate(video_id: String!): Date
```

```js
video {
  id:  String(11),
  original_title: String,
  title:	String,
  artist: String,
  duration:	Int,
  publishedAt: full_date ? Date : String,
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
# dependencies

[Axios](https://github.com/axios/axios)

[Moment.js](https://github.com/moment/moment/)
