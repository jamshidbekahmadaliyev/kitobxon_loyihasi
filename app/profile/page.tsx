import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import Link from "next/link"
import { Settings, LogOut, Clock, MessageSquare, MessageCircle, Users, UserPlus, Bell, Share2, Compass, BookOpen } from "lucide-react"

export default async function ProfilePage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  const [user] = await db.select().from(users).where(eq(users.id, session.user.id))

  const mobileLinks = [
    { name: "O'qish jarayoni", href: "/progress", icon: Clock },
    { name: "Fikrlarim", href: "/my-thoughts", icon: MessageSquare },
    { name: "Suhbatlar", href: "/chats", icon: MessageCircle },
    { name: "Do'stlar", href: "/friends", icon: UserPlus },
    { name: "Mualliflar", href: "/authors", icon: Users },
    { name: "Xabarnomalar", href: "/notifications", icon: Bell },
    { name: "Do'st taklif qilish", href: "/invite", icon: Share2 },
    { name: "Sozlamalar", href: "/settings", icon: Settings },
  ];

  return (
    <div className="max-w-md mx-auto xl:max-w-4xl p-4 xl:p-8 min-h-screen bg-[#FDFBF7]">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[#1C4E41] to-green-600"></div>
        
        <div className="w-24 h-24 bg-white rounded-full p-1 mt-10 relative z-10 shadow-lg">
          <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-3xl overflow-hidden">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              user?.displayName?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase()
            )}
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mt-4">{user?.displayName || "Foydalanuvchi"}</h1>
        <p className="text-gray-500">@{user?.username}</p>
        <p className="text-sm mt-4 text-gray-700 max-w-sm">{user?.bio || "Hali o'zi haqida ma'lumot kiritmadi."}</p>
        
        <Link href="/settings" className="mt-6 bg-[#1C4E41]/10 text-[#1C4E41] font-semibold px-6 py-2 rounded-full text-sm">
          Profilni tahrirlash
        </Link>
      </div>

      <div className="xl:hidden bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="p-4 border-b border-gray-50">
          <h2 className="font-bold text-gray-900">Menyular</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {mobileLinks.map(link => {
            const Icon = link.icon;
            return (
              <Link key={link.name} href={link.href} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#EAF3EF] flex items-center justify-center text-[#1C4E41]">
                     <Icon size={16} />
                  </div>
                  <span className="font-semibold text-sm text-gray-700">{link.name}</span>
                </div>
                <ChevronRightIcon />
              </Link>
            )
          })}
        </div>
      </div>
      
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
        <p className="text-gray-500 text-sm mb-4">Profilga oid barcha moslamalar tahrirlash bo'limida.</p>
        <Link href="/api/auth/signout" className="flex items-center justify-center gap-2 text-red-500 font-bold py-3 rounded-xl hover:bg-red-50 transition-colors">
          <LogOut size={18} /> Tizimdan chiqish
        </Link>
      </div>
    </div>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  )
}
