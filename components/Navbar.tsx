"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Users, User, Compass, BookOpen, Bell, Menu } from "lucide-react";

export default function Navbar({ isAuthenticated, isAdmin, userDisplayName, userUsername }: { isAuthenticated: boolean, isAdmin?: boolean, userDisplayName?: string, userUsername?: string }) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Top Navbar (sits to the right of the 64-width Sidebar) */}
      <header className="hidden xl:flex sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 h-20 items-center justify-between px-8 transition-all ml-64">
        
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1C4E41]" size={18} />
            <input 
              type="text" 
              placeholder="Kitob, muallif yoki fikr qidiring..." 
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-10 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C4E41]/20 focus:border-[#1C4E41] transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd className="hidden sm:inline-block bg-white border border-gray-200 rounded px-1.5 py-0.5 text-[10px] font-mono text-gray-400">Ctrl</kbd>
              <kbd className="hidden sm:inline-block bg-white border border-gray-200 rounded px-1.5 py-0.5 text-[10px] font-mono text-gray-400">K</kbd>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6 ml-8">
          <nav className="flex items-center gap-6">
            <Link href="/search" className={`flex items-center gap-2 text-sm font-semibold transition-colors ${pathname === '/search' ? 'text-[#1C4E41]' : 'text-gray-600 hover:text-gray-900'}`}>
              <Compass size={18} /> Kashf etish
            </Link>
            <Link href="/community" className={`flex items-center gap-2 text-sm font-semibold transition-colors ${pathname === '/community' ? 'text-[#1C4E41]' : 'text-gray-600 hover:text-gray-900'}`}>
              <Users size={18} /> Hamjamiyat
            </Link>
            <Link href={isAuthenticated ? "/profile" : "/login"} className={`flex items-center gap-2 text-sm font-semibold transition-colors ${pathname === '/profile' ? 'text-[#1C4E41]' : 'text-gray-600 hover:text-gray-900'}`}>
              <BookOpen size={18} /> Kutubxonam
            </Link>
          </nav>

          <div className="w-px h-6 bg-gray-200"></div>

          <button className="text-gray-500 hover:text-gray-900 transition-colors relative">
            <Bell size={20} />
            <span className="absolute 0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {isAuthenticated ? (
            <Link href="/profile" className="flex items-center gap-3 hover:bg-gray-50 p-1.5 rounded-full pr-4 transition-colors">
              <div className="w-9 h-9 bg-gradient-to-br from-[#1C4E41] to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {userDisplayName ? userDisplayName.charAt(0).toUpperCase() : userUsername?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-bold text-gray-900 leading-none">{userDisplayName || userUsername}</p>
                <p className="text-xs text-gray-500 mt-0.5">@{userUsername}</p>
              </div>
            </Link>
          ) : (
            <Link href="/login" className="bg-[#1C4E41] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#153D32] transition-colors">
              Kirish
            </Link>
          )}
        </div>
      </header>

      {/* Mobile Top Navbar */}
      <header className="xl:hidden flex sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 items-center justify-between">
        <Link href="/" className="text-xl font-black tracking-tighter text-[#1C4E41]">
          KITOBXON
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/search" className="text-gray-500"><Search size={20}/></Link>
          {isAuthenticated ? (
             <Link href="/profile">
               <div className="w-8 h-8 bg-gradient-to-br from-[#1C4E41] to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                 {userDisplayName ? userDisplayName.charAt(0).toUpperCase() : userUsername?.charAt(0).toUpperCase() || "U"}
               </div>
             </Link>
          ) : (
            <Link href="/login" className="text-sm font-bold text-[#1C4E41]">Kirish</Link>
          )}
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around p-2">
           <Link href="/" className={`flex flex-col items-center p-2 rounded-xl transition-all ${pathname === '/' ? 'text-[#1C4E41]' : 'text-gray-400'}`}>
              <Compass size={24} strokeWidth={pathname === '/' ? 2.5 : 2} />
           </Link>
           <Link href="/community" className={`flex flex-col items-center p-2 rounded-xl transition-all ${pathname === '/community' ? 'text-[#1C4E41]' : 'text-gray-400'}`}>
              <Users size={24} strokeWidth={pathname === '/community' ? 2.5 : 2} />
           </Link>
           <div className="-mt-6">
             <Link href="/books/new" className="flex items-center justify-center w-12 h-12 bg-[#1C4E41] text-white rounded-full shadow-lg shadow-green-900/20 hover:scale-105 transition-transform">
                <span className="text-2xl mb-1">+</span>
             </Link>
           </div>
           <Link href="/search" className={`flex flex-col items-center p-2 rounded-xl transition-all ${pathname === '/search' ? 'text-[#1C4E41]' : 'text-gray-400'}`}>
              <Search size={24} strokeWidth={pathname === '/search' ? 2.5 : 2} />
           </Link>
           <Link href={isAuthenticated ? "/profile" : "/login"} className={`flex flex-col items-center p-2 rounded-xl transition-all ${pathname === '/profile' ? 'text-[#1C4E41]' : 'text-gray-400'}`}>
              <User size={24} strokeWidth={pathname === '/profile' ? 2.5 : 2} />
           </Link>
        </div>
      </nav>
    </>
  );
}
