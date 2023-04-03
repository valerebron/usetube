import Video from './video'

export default interface SearchResult {
  videos:                Video[],
  didyoumean:            string,  // spelling proposal
  token:                 string,  // number of call to next page
  apikey:                string,  // api key to get more data (next/prev page result)
}
