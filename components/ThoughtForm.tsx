"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ThoughtForm({ bookId }: { bookId: string }) {
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState("")
  const [isSpoiler, setIsSpoiler] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    const res = await fetch("/api/thoughts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId, content, containsSpoiler: isSpoiler })
    })
    
    if (res.ok) {
      setContent("")
      setIsSpoiler(false)
      router.refresh()
    } else if (res.status === 401) {
      router.push("/login")
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-8">
      <h3 className="font-bold text-lg mb-4 text-[#1C4E41]">Fikr yozish</h3>
      <textarea 
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Bu kitob haqida nima deb o'ylaysiz? Qanday g'oyalar sizga ta'sir qildi?"
        className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1C4E41] mb-4 min-h-[120px] resize-y"
        required
      />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input type="checkbox" checked={isSpoiler} onChange={(e) => setIsSpoiler(e.target.checked)} className="rounded text-[#1C4E41] focus:ring-[#1C4E41]" />
          Spoiler mavjud
        </label>
        <button type="submit" disabled={loading} className="bg-[#1C4E41] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#153D32] transition-colors disabled:opacity-50">
          Yuborish
        </button>
      </div>
    </form>
  )
}
