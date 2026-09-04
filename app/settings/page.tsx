import { auth } from "@/auth"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { Settings as SettingsIcon } from "lucide-react"

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const [user] = await db.select().from(users).where(eq(users.id, session.user.id))

  async function updateProfile(formData: FormData) {
    "use server"
    const displayName = formData.get("displayName") as string
    const bio = formData.get("bio") as string
    const avatarUrl = formData.get("avatarUrl") as string

    if (!session?.user?.id) return

    await db.update(users)
      .set({ displayName, bio, avatarUrl })
      .where(eq(users.id, session.user.id))

    redirect("/profile")
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 min-h-screen">
      <h1 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
        <SettingsIcon className="text-[#1C4E41]" /> Sozlamalar
      </h1>
      
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <form action={updateProfile} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">To'liq ismingiz</label>
            <input 
              type="text" 
              name="displayName" 
              defaultValue={user?.displayName || ""}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1C4E41]/50 focus:border-[#1C4E41] transition-all" 
              placeholder="Masalan: Alisher Navoiy" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Profil rasmi (URL)</label>
            <input 
              type="url" 
              name="avatarUrl" 
              defaultValue={user?.avatarUrl || ""}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1C4E41]/50 focus:border-[#1C4E41] transition-all" 
              placeholder="https://example.com/avatar.jpg" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">O'zingiz haqingizda</label>
            <textarea 
              name="bio" 
              rows={4} 
              defaultValue={user?.bio || ""}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1C4E41]/50 focus:border-[#1C4E41] transition-all" 
              placeholder="Men kitob o'qishni va xulosalar yozishni yoqtiraman..."
            ></textarea>
          </div>

          <button type="submit" className="w-full bg-[#1C4E41] text-white p-4 rounded-xl hover:bg-[#153D32] transition-colors font-bold mt-2 shadow-lg shadow-green-900/20">
            Saqlash
          </button>
        </form>
      </div>
    </div>
  )
}
