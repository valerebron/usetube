export default function formatYoutubeCount(raw) {
  const isMill = raw?.includes('M')
  const isKilo = raw?.includes('k')
  let nbSubscriber = raw?.replace(/[^0-9,.]/g, '').replace(',', '.')
  if (isMill) { 
    nbSubscriber *= 1000000
  }
  else if (isKilo) {
    nbSubscriber *= 1000
  }
  return parseInt(nbSubscriber) || 0
}
