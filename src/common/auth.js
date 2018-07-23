// @flow

import jwt from 'jsonwebtoken'
import { User } from '../model'
import { jwtSecret } from './config'

type UserType = {
  _id: string,
}

export async function getUser(token: ?string) {
  if (!token) return { user: null }

  try {
    const decodedToken = jwt.verify(token.substring(4), jwtSecret)

    const user = await User.findOne({ _id: decodedToken.id })

    return {
      user,
    }
  } catch (err) {
    return { user: null }
  }
}

export const generateToken = (user: UserType) =>
  `JWT ${jwt.sign({ id: user._id }, jwtSecret)}`

export const getFacebookUserInfo = async (token: string) => {
  const request =
    `https://graph.facebook.com/v3.0/me?access_token=${token}` +
    '&id,name,picture,email' +
    '&format=json'
  console.log('request facebook', request)
  const response = await fetch(request)
  return response.json()
}
