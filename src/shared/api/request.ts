const BASE_URL = 'https://api.thecatapi.com/v1'
const API_KEY = import.meta.env.VITE_CAT_API_KEY as string | undefined

if (!API_KEY) {
  console.warn('Missing VITE_CAT_API_KEY in .env')
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(API_KEY ? { 'x-api-key': API_KEY } : {}),
      ...(init?.headers ?? {}),
    },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`API error ${res.status}: ${text || res.statusText}`)
  }

  return (await res.json()) as T
}
