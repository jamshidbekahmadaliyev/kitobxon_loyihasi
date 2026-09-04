import { auth } from "@/auth"
import { db } from "@/db"
import { users, follows } from "@/db/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { UserPlus } from "lucide-react"
import Link from "next/link"
import FollowButton from "@/components/FollowButton"

export default async function FriendsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const myFollows = await db.select({
    id: users.id,
    username: users.username,
    displayName: users.displayName,
    avatarUrl: users.avatarUrl
  }).from(follows)
    .innerJoin(users, eq(follows.followingId, users.id))
    .where(eq(follows.followerId, session.user.id))

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 min-h-screen">
      <h1 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
        <UserPlus className="text-[#1C4E41]" /> Kuzatilayotgan do'stlar
      </h1>
      
      {myFollows.length === 0 ? (
         <div className="bg-white p-12 rounded-3xl text-center border border-gray-100 shadow-sm">
           <UserPlus size={48} className="mx-auto text-gray-200 mb-4" />
           <h2 className="text-xl font-bold text-gray-900 mb-2">Siz hali hech kimni kuzatmayapsiz</h2>
           <p className="text-gray-500 mb-6">Kitobxonlar reytingiga o'tib, o'zingizga yoqqan insonlarni toping.</p>
           <Link href="/authors" className="bg-[#1C4E41] text-white px-6 py-3 rounded-xl font-bold">
             Mualliflarni ko'rish
           </Link>
         </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-50">
            {myFollows.map((u) => (
              <div key={u.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                 <Link href={`/profile`} className="flex items-center gap-4 group">
                   <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 font-bold overflow-hidden shadow-sm">
                     {u.avatarUrl ? <img src={u.avatarUrl} className="w-full h-full object-cover" /> : u.username.charAt(0).toUpperCase()}
                   </div>
                   <div>
                     <h3 className="font-bold text-gray-900 group-hover:text-[#1C4E41] transition-colors">{u.displayName || u.username}</h3>
                     <p className="text-xs text-gray-500 font-medium">@{u.username}</p>
                   </div>
                 </Link>
                 <FollowButton targetUserId={u.id} initialFollowing={true} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
