import Axios, { type AxiosInstance } from 'axios'

const http: AxiosInstance = Axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_ENDPOINT,
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (config.headers) {
    config.headers['Content-type'] = 'application/json'
    if (token) config.headers['Authorization'] = 'Bearer ' + token
  }
  return config
})

export default http