import AsyncStorage from '@react-native-async-storage/async-storage'
import { Usuario } from '../types'

const ACCESS_TOKEN_KEY = 'alles_access_token'
const REFRESH_TOKEN_KEY = 'alles_refresh_token'
const USER_KEY = 'alles_user'

export async function saveAuthSession(
  accessToken: string,
  refreshToken: string,
  user: Usuario,
) {
  await AsyncStorage.multiSet([
    [ACCESS_TOKEN_KEY, accessToken],
    [REFRESH_TOKEN_KEY, refreshToken],
    [USER_KEY, JSON.stringify(user)],
  ])
}

export async function clearAuthSession() {
  await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY])
}

export async function getAccessToken() {
  return AsyncStorage.getItem(ACCESS_TOKEN_KEY)
}

export async function getStoredUser(): Promise<Usuario | null> {
  const raw = await AsyncStorage.getItem(USER_KEY)
  return raw ? (JSON.parse(raw) as Usuario) : null
}
