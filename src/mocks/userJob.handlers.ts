import { delay, http, HttpResponse } from 'msw'
import { userJobs } from './data/userJobs'

const url = (path: string) => `${import.meta.env.VITE_SYSTEM_API}/${path}`

export const handlers = [
  http.get(url(`user-jobs/:userJobId/content`), async ({ params: { userJobId } }) => {
    await delay()

    if (userJobId === userJobs[0].id) {
      return HttpResponse.text(`Product Id,Flag
        P560-835,Disco
        P560-821,Planned Drop`)
    }

    return new HttpResponse(null, { status: 404, statusText: 'Not Found' })
  })
]
