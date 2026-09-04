"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState("")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    
    const formData = new FormData(e.currentTarget)
    const username = formData.get("username")
    const displayName = formData.get("displayName")
    const password = formData.get("password")

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, displayName, password })
    })

    if (res.ok) {
      router.push("/login")
    } else {
      const data = await res.json()
      setError(data.error || "Xatolik yuz berdi")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-[#1C4E41]">Ro'yxatdan o'tish</h1>
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Foydalanuvchi nomi</label>
            <input type="text" name="username" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C4E41]" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ismingiz</label>
            <input type="text" name="displayName" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C4E41]" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Parol</label>
            <input type="password" name="password" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C4E41]" required />
          </div>
          <button type="submit" className="w-full bg-[#1C4E41] text-white p-2 rounded-lg hover:bg-[#153D32] transition-colors font-medium">Ro'yxatdan o'tish</button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Profilingiz bormi? <a href="/login" className="text-[#1C4E41] hover:underline">Tizimga kirish</a>
        </p>
      </div>
    </div>
  )
}
