// app/lib/llmProviders.ts
// Centralized provider configs for Groq (primary) and OpenRouter (fallback)

import Groq from "groq-sdk"
import OpenAI from "openai"

// --- Groq (primary) ---
export const groqClient = new Groq({
  apiKey: process.env.GROK_API_KEY!,
})

export const GROQ_MODEL = "llama-3.3-70b-versatile"

// --- OpenRouter (fallback) ---
export const openRouterClient = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://dev-dna.vercel.app",
    "X-Title": "DevDNA",
  },
})

export const OPENROUTER_MODEL = "meta-llama/llama-3.3-70b-instruct"
