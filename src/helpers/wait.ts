export default function wait() {
  let ms = Math.floor(Math.random() * 300)
  let start = new Date().getTime()
  let end = start
  while(end < start + ms) {
    end = new Date().getTime()
 }
}
