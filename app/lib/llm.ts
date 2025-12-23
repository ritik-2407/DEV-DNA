
// app/lib/llm.ts
import Groq from "groq-sdk"

export const groq = new Groq({
  apiKey: process.env.GROK_API_KEY!,
})

export async function runLLM(prompt: string) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.6,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  })

  return completion.choices[0].message.content
}
