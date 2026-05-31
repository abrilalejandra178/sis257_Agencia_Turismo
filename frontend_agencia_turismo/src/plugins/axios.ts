import Axios, { type AxiosInstance } from 'axios'

const http: AxiosInstance = Axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_ENDPOINT,
  headers: {
    'Content-type': 'application/json',
  },
})

export default http
