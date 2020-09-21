#
# **Usetube.js**
### Crawl youtube without api key (search videos, search channels, get all channel's videos)

### Each function return a **Promise**

### This script **scrap** youtube site so you **don't need API key**

#
# usage
```
searchVideo(terms: String, full_date: false): [video]

searchChannel(terms: String): [channel]

getChannelVideos(channel_id: String, published_after: Date): [video]

getChannelDesc(channel_id: String): String

getVideoDate(video_id: String): Date
```

### notes:
searchVideo() return "time from now" date format.

If you want the javascript Date() format, pass full_date = true

(note: the query will take more time for that)

#
# types definitions
```
video {
  id:  String(11),
  original_title: String,
  title:	String,
  artist: String,
  duration:	Int,
  publishedAt: full_date ? Date : String,
}
```
```
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
#
# dependencies

[Axios](https://github.com/axios/axios)

[Moment.js](https://github.com/moment/moment/)
