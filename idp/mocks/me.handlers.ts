import { http, HttpResponse } from 'msw'
import { me } from './data/me'

const url = (path: string) => `${import.meta.env.VITE_SYSTEM_API}/${path}`

export const handlers = [
  http.get(url('me'), async () => HttpResponse.json(me)),
  http.put(url('me'), async () => {
    return new HttpResponse(JSON.stringify(me), { status: 200, statusText: 'OK' })
  })
]
