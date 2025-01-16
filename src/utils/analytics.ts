import type { AnalyticsBrowserSettings } from '@segment/analytics-next'
import { AnalyticsBrowser } from '@segment/analytics-next'

const writeKey = import.meta.env.VITE_SEGMENT_API_KEY

const settings: AnalyticsBrowserSettings = {
  writeKey
}

let analytics: AnalyticsBrowser | null = null

if (writeKey) {
  analytics = AnalyticsBrowser.load(settings)
}

export default analytics
