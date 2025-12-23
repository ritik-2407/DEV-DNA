"use client"

import { useEffect } from "react"

export default function HomePage() {
  useEffect(() => {
    
    fetch("/api/github/sync", { method: "POST" })
  }, [])

  return (
    <main style={{ padding: 40 }}>
      <h1>Protected Home</h1>
      <p>Preparing your GitHub profile...</p>
    </main>
  )
}
