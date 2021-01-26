# **Usetube.js**

[![Version](https://img.shields.io/npm/v/usetube.svg)](https://www.npmjs.com/package/usetube)
[![Downloads](https://img.shields.io/npm/dt/usetube.svg)](https://www.npmjs.com/package/usetube)
[![Downloads](https://img.shields.io/npm/dw/usetube)](https://www.npmjs.com/package/usetube)

### with usetube you Crawl youtube so you can **search videos** or **channels**, you can also **grab all channel's videos** at once

### This script is **google api key free** (so you don't need google account)

### This script is **google Quota free** (you can retrieve all videos a channel can give you)

<br>

# install
```shell
npm install usetube
```

# usage

```js
const usetube = require('usetube')
await usetube.searchVideo('IMANU')
```

# types definitions
```js
searchVideo(terms: String!, token: String?): [video], didyoumean, token

searchChannel(terms: String!, token: String?): [channel], didyoumean, token

getChannelVideos(channel_id: String!, published_after: Date?): [video]

getPlaylistVideos(playlist_id: String!): [video]

getChannelDesc(channel_id: String!): String

getVideoDesc(video_id: String!): String

getVideoDate(video_id: String!): Date

getVideosFromDesc(video_id: String!): [video]
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
