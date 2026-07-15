import axios from 'axios'
import Constants from 'expo-constants'
import { getAccessToken } from './storage'

const apiUrl =
  process.env.EXPO_PUBLIC_API_URL ||
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ||
  'http://10.0.2.2:8080/api'

export const api = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
})

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
