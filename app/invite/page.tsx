import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Share2, Copy, Gift, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function InvitePage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  // Bot username
  const BOT_USERNAME = process.env.NEXT_PUBLIC_BOT_USERNAME || "kitobdan_hulosa_bot"
  // Referral parameter (just user ID for now)
  const refLink = `https://t.me/${BOT_USERNAME}?start=${session.user.id}`
  const shareText = "Ajoyib kitoblar olami va fikrlar maydoni bo'lgan KITOBXON platformasiga qo'shil!"

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center relative overflow-hidden">
        
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-50 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-50 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-[#1C4E41] to-green-600 rounded-full mx-auto flex items-center justify-center text-white mb-6 shadow-lg shadow-green-900/20">
            <Gift size={32} />
          </div>
          
          <h1 className="text-2xl font-black text-gray-900 mb-2">Do'stlarni taklif qiling!</h1>
          <p className="text-gray-500 mb-8 font-medium">Do'stlaringizni taklif qiling va birgalikda kitob mutolaa qilib, fikr almashing.</p>
          
          <div className="bg-gray-50 p-4 rounded-2xl mb-8 border border-gray-100">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 text-left">Sizning shaxsiy havolangiz</p>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                readOnly 
                value={refLink}
                className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 focus:outline-none"
              />
              <button className="bg-gray-900 text-white p-2.5 rounded-xl hover:bg-gray-800 transition-colors">
                <Copy size={16} />
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
             <a 
               href={`https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${encodeURIComponent(shareText)}`}
               target="_blank"
               rel="noopener noreferrer"
               className="w-full bg-[#0088cc] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0077b5] transition-colors shadow-lg shadow-blue-500/20"
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.896-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.896-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
               Telegram orqali jo'natish
             </a>
          </div>
          
          <Link href="/" className="inline-block mt-6 text-sm font-semibold text-gray-500 hover:text-[#1C4E41]">
            Bosh sahifaga qaytish
          </Link>
        </div>
      </div>
    </div>
  )
}
