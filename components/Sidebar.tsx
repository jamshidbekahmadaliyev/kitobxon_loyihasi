"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, BookOpen, Clock, MessageSquare, MessageCircle, Users, UserPlus, Bell, Settings, PenTool, CheckCircle, PauseCircle, XCircle, Share2, ShieldAlert } from "lucide-react";

export default function Sidebar({ 
  isAuthenticated, 
  readingStats = { reading: 0, wantToRead: 0, finished: 0, paused: 0, dropped: 0 },
  isAdmin = false
}: { 
  isAuthenticated: boolean,
  readingStats?: { reading: number, wantToRead: number, finished: number, paused: number, dropped: number },
  isAdmin?: boolean
}) {
  const pathname = usePathname();
  
  const mainLinks = [
    { name: "Bosh sahifa", href: "/", icon: Home },
    { name: "Kashf etish", href: "/search", icon: Compass },
    { name: "Kutubxonam", href: isAuthenticated ? "/profile" : "/login", icon: BookOpen },
    { name: "O'qish jarayoni", href: isAuthenticated ? "/progress" : "/login", icon: Clock },
    { name: "Fikrlarim", href: isAuthenticated ? "/my-thoughts" : "/login", icon: MessageSquare },
    { name: "Suhbatlar", href: isAuthenticated ? "/chats" : "/login", icon: MessageCircle },
    { name: "Mualliflar", href: "/authors", icon: Users },
    { name: "Do'stlar", href: isAuthenticated ? "/friends" : "/login", icon: UserPlus },
    { name: "Xabarnomalar", href: isAuthenticated ? "/notifications" : "/login", icon: Bell },
    { name: "Do'st taklif qilish", href: isAuthenticated ? "/invite" : "/login", icon: Share2 },
    { name: "Sozlamalar", href: isAuthenticated ? "/settings" : "/login", icon: Settings },
  ];

  if (isAdmin) {
    mainLinks.push({ name: "Admin Panel", href: "/admin", icon: ShieldAlert });
  }

  return (
    <aside className="hidden xl:flex flex-col w-64 h-screen fixed left-0 top-0 bg-[#FDFBF7] border-r border-gray-100 overflow-y-auto pt-6 px-4 custom-scrollbar z-50">
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="bg-[#1C4E41] text-white p-2 rounded-lg">
           <BookOpen size={24} />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight text-[#1C4E41] leading-none">KITOBXON</h1>
          <p className="text-[10px] text-gray-500 mt-1 font-medium">Kitobni o'qima. Undan fikr yarat.</p>
        </div>
      </div>

      <nav className="space-y-1 mb-8">
        {mainLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link key={link.name} href={link.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive ? 'bg-[#EAF3EF] text-[#1C4E41]' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
              <Icon size={18} className={isActive ? 'text-[#1C4E41]' : 'text-gray-400'} />
              {link.name}
            </Link>
          )
        })}
      </nav>

      {isAuthenticated && (
        <div className="mb-8 px-2">
          <h3 className="text-xs font-bold text-gray-900 mb-4">O'qishdagi holatingiz</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-600 font-medium"><BookOpen size={16} className="text-[#1C4E41]"/> O'qiyapman</div>
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs font-bold">{readingStats.reading}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-600 font-medium"><Clock size={16} className="text-yellow-500"/> O'qimoqchiman</div>
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs font-bold">{readingStats.wantToRead}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-600 font-medium"><CheckCircle size={16} className="text-green-500"/> Tugatdim</div>
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs font-bold">{readingStats.finished}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-600 font-medium"><PauseCircle size={16} className="text-blue-500"/> To'xtatilgan</div>
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs font-bold">{readingStats.paused}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-600 font-medium"><XCircle size={16} className="text-red-400"/> Tashlab qo'yilgan</div>
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs font-bold">{readingStats.dropped}</span>
            </div>
          </div>
        </div>
      )}

      {isAuthenticated && (
        <div className="mt-auto mb-6 bg-gradient-to-br from-[#F5F9F7] to-[#EAF3EF] p-4 rounded-2xl border border-[#D1E6DD]">
          <h4 className="font-bold text-sm text-[#1C4E41] mb-1">Bugun fikr yozdingizmi?</h4>
          <p className="text-xs text-gray-600 mb-4 font-medium">O'qigan kitobingizdan bitta fikr yozib qoldiring.</p>
          <Link href="/books/new" className="w-full bg-[#1C4E41] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#153D32] transition-colors flex items-center justify-center gap-2 shadow-sm">
            <PenTool size={16} /> Fikr yozish
          </Link>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 4px; }
      `}} />
    </aside>
  );
}
