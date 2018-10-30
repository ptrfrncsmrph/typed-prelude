import { ServerHistory, ServerLocation } from './server'
import { HistoryResources, Path } from './types'

export function historyResources(href: Path = '/'): HistoryResources {
  if (typeof location !== 'undefined' && typeof history !== 'undefined') {
    return { location, history }
  }

  const serverLocation = new ServerLocation(href)
  const serverHistory = new ServerHistory(serverLocation)
  serverLocation.setHistory(serverHistory)

  return {
    location: serverLocation,
    history: serverHistory,
  }
}
