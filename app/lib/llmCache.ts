type CacheEntry = {
    data : any,
    timestamp: number
}

const CACHE_TTL = 1000 * 60 * 60 //1 hour

const llmCache = new Map<string, CacheEntry>()

export function getCachedLLM(key: string){
    const entry = llmCache.get(key)
    if (!entry) return null

    const expired = Date.now() - entry.timestamp > CACHE_TTL

    if(expired){
        llmCache.delete(key)
        return null
    }

    return entry.data
}

export function setCachedLLM(key: string, data: any) {
  llmCache.set(key, {
    data,
    timestamp: Date.now(),
  })
}
