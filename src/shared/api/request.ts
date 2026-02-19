const BASE_URL = 'https://api.thecatapi.com/v1'
const API_KEY = import.meta.env.VITE_CAT_API_KEY as string | undefined
export const SUB_ID = 'catgallery-dorian'

if (!API_KEY) console.warn('Missing VITE_CAT_API_KEY in .env')

type ApiErrorBody = { message?: string; [key: string]: unknown }

const tryParseJson = async (res: Response): Promise<unknown | null> => {
  const contentType = res.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) return null
  try {
    return await res.json()
  } catch {
    return null
  }
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
    const json = (await tryParseJson(res)) as ApiErrorBody | null
    const text = json ? JSON.stringify(json) : await res.text().catch(() => '')
    throw new Error(`API error ${res.status}: ${text || res.statusText}`)
  }

  if (res.status === 204) {
    return undefined as T
  }

  const json = await tryParseJson(res)
  if (json !== null) return json as T

  const text = await res.text()
  if (!text) return undefined as T
  try {
    return JSON.parse(text) as T
  } catch {
    return text as unknown as T
  }
}

export const jsonRequestInit = (body: unknown, init?: RequestInit): RequestInit => ({
  ...init,
  headers: {
    'Content-Type': 'application/json',
    ...(init?.headers ?? {}),
  },
  body: JSON.stringify(body),
})
