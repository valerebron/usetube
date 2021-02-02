# **Usetube.js**

[![Version](https://img.shields.io/npm/v/usetube.svg)](https://www.npmjs.com/package/usetube)
[![Downloads](https://img.shields.io/npm/dt/usetube.svg)](https://www.npmjs.com/package/usetube)


### no google account needed

### retrieve all videos a channel can give you

<br>

# usage

```js
const usetube = require('usetube')
await usetube.searchVideo('Lorn')
```

# methods
```js
searchVideo(terms)
searchChannel(terms)
getChannelVideos(channel_id)
getPlaylistVideos(playlist_id)
getChannelDesc(channel_id)
getVideoDesc(video_id)
getVideoDate(video_id)
getVideosFromDesc(video_id)
```

# returned datas
```js
video {
  id
  original_title
  title
  artist
  duration
  publishedAt
}
```
```js
channel {
  name
  channel_id
  nb_videos
  nb_subscriber
  official
  channel_avatar_small
  channel_avatar_medium
}
```
