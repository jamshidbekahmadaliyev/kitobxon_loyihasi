"use client"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlError = searchParams.get("error")
  const [error, setError] = useState(urlError ? "Login yoki parol noto'g'ri. Iltimos tekshirib qaytadan kiriting." : "")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    
    const formData = new FormData(e.currentTarget)
    const username = formData.get("username") as string
    const password = formData.get("password") as string

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError("Login yoki parol noto'g'ri. Iltimos tekshirib qaytadan kiriting.")
    } else {
      router.push("/")
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-[#1C4E41]">Tizimga kirish</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Foydalanuvchi nomi</label>
            <input type="text" name="username" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C4E41]" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Parol</label>
            <input type="password" name="password" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C4E41]" required />
          </div>
          <button type="submit" className="w-full bg-[#1C4E41] text-white p-2 rounded-lg hover:bg-[#153D32] transition-colors font-medium">Kirish</button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Profilingiz yo'qmi? <a href="/register" className="text-[#1C4E41] hover:underline">Ro'yxatdan o'tish</a>
        </p>
      </div>
    </div>
  )
}
