const getApiBaseUrl = () => {
  const url = import.meta.env.VITE_API_BASE_URL
  if (!url) {
    throw new Error('VITE_API_BASE_URL is not set')
  }
  const normalized = url.trim().replace(/\/+$/, '')
  console.log('[API URL Debug] Original:', url, 'Normalized:', normalized)
  return normalized
}

const API_BASE_URL = getApiBaseUrl()

export const buildApiUrl = (path) => {
  const base = API_BASE_URL.replace(/\/+$/, '')
  const cleanPath = path.replace(/^\/+/, '')
  const finalUrl = `${base}/${cleanPath}`
  console.log('[buildApiUrl] Base:', base, 'Path:', path, 'Final URL:', finalUrl)
  return finalUrl
}
