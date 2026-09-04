"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AvatarUpload({ currentUrl }: { currentUrl?: string | null }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      // Get presigned URL
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type })
      })

      if (!res.ok) throw new Error("Upload failed")
      const { signedUrl, publicUrl } = await res.json()

      // Upload to R2 directly
      await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type }
      })

      // We would then save publicUrl to the user profile in DB (not implemented here for brevity)
      alert("Rasm yuklandi: " + publicUrl)
      router.refresh()
    } catch (err) {
      alert("Xatolik yuz berdi")
    }
    setLoading(false)
  }

  return (
    <div className="relative">
      <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden border-4 border-white shadow-sm">
        {currentUrl ? <img src={currentUrl} className="w-full h-full object-cover" alt="Avatar" /> : null}
      </div>
      <label className="absolute bottom-0 right-0 bg-[#1C4E41] text-white p-2 rounded-full cursor-pointer hover:bg-[#153D32] transition-colors shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={loading} />
      </label>
    </div>
  )
}
