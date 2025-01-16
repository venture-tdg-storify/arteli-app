import { http, HttpResponse } from 'msw'
import { domain } from '@/config/auth.config'
import { auth0User } from './data/authUser'

export const handlers = [
  http.get(`https://${domain}/api/v2/users/650c50b9da1617bd4ee9547b`, async () => {
    return HttpResponse.json(auth0User)
  })
]
