import { db } from "@/db"
import { users } from "@/db/schema"
import { desc } from "drizzle-orm"
import { Users as UsersIcon, Award } from "lucide-react"
import FollowButton from "@/components/FollowButton"

export default async function AuthorsPage() {
  const topUsers = await db.select().from(users).orderBy(desc(users.createdAt)).limit(20);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 min-h-screen">
      <div className="bg-[#1C4E41] rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
            <UsersIcon /> Kitobxonlar Reytingi
          </h1>
          <p className="text-green-100 font-medium">Platformaning eng faol a'zolari va mualliflari bilan tanishing.</p>
        </div>
        <Award className="absolute -right-4 -bottom-4 text-green-900/30" size={160} />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-50">
          {topUsers.map((u, i) => (
            <div key={u.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
               <div className="flex items-center gap-4">
                 <div className="w-8 flex justify-center text-lg font-black text-gray-300">
                   {i + 1}
                 </div>
                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 font-bold overflow-hidden shadow-sm">
                   {u.avatarUrl ? <img src={u.avatarUrl} className="w-full h-full object-cover" /> : u.username.charAt(0).toUpperCase()}
                 </div>
                 <div>
                   <h3 className="font-bold text-gray-900">{u.displayName || u.username}</h3>
                   <p className="text-xs text-gray-500 font-medium">@{u.username}</p>
                 </div>
               </div>
               <FollowButton targetUserId={u.id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
