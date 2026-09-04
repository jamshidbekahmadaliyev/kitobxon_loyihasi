"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LibraryButton({ bookId, currentStatus }: { bookId: string, currentStatus?: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleUpdate = async (status: string) => {
    setLoading(true)
    const res = await fetch("/api/library", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId, status })
    })
    
    if (res.ok) {
      router.refresh()
    } else if (res.status === 401) {
      router.push("/login")
    }
    setLoading(false)
  }

  if (currentStatus === "reading") {
    return <button onClick={() => handleUpdate("finished")} disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">Tugatdim</button>
  }

  if (currentStatus === "finished") {
    return <button disabled className="bg-gray-100 text-gray-500 px-6 py-2 rounded-lg font-medium cursor-not-allowed">O'qilgan</button>
  }

  return (
    <button onClick={() => handleUpdate("reading")} disabled={loading} className="bg-[#1C4E41] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#153D32] transition-colors">
      Kutubxonamga qo'shish
    </button>
  )
}
