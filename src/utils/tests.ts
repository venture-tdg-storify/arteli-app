import { random } from '@arteli/utils'
import dayjs from 'dayjs'
import { auth0User } from '@/mocks/data/authUser'

export const mockTokens = ({ userId = random.Number } = {}, sub: string = '650c50b9da1617bd4ee9547b') => ({
  access_token: random.String,
  id_token: [
    random.String,
    btoa(
      JSON.stringify({
        'app:claims': JSON.stringify({ arteli: { userId } }),
        sub,
        exp: dayjs().add(10, 'minute').unix(),
        name: auth0User.name,
        email: auth0User.email,
        picture: auth0User.picture
      })
    ),
    random.String
  ].join('.'),
  scope: 'openid profile email'
})
