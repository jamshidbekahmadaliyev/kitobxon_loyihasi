import { db } from "@/db";
import { books, thoughts, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { Star, ChevronRight, Heart, MessageSquare, Share2, Bookmark } from "lucide-react";
import FollowButton from "@/components/FollowButton";

import { auth } from "@/auth";
import { userBooks } from "@/db/schema";

export default async function Home() {
  const session = await auth();
  const allBooks = await db.select().from(books).limit(10);
  const heroBook = allBooks.length > 0 ? allBooks[0] : null;
  
  let stats = { read: 0, thoughts: 0, likes: 0 };
  if (session?.user?.id) {
    const finishedBooks = await db.select().from(userBooks).where(eq(userBooks.userId, session.user.id));
    stats.read = finishedBooks.filter(b => b.status === "finished").length;
    
    const userThoughts = await db.select().from(thoughts).where(eq(thoughts.userId, session.user.id));
    stats.thoughts = userThoughts.length;
  }

  // Get recent thoughts with user info
  const recentThoughts = await db.select({
    id: thoughts.id,
    content: thoughts.content,
    createdAt: thoughts.createdAt,
    authorName: users.displayName,
    authorUsername: users.username,
    bookTitle: books.title,
  }).from(thoughts)
    .leftJoin(users, eq(thoughts.userId, users.id))
    .leftJoin(books, eq(thoughts.bookId, books.id))
    .orderBy(desc(thoughts.createdAt))
    .limit(5);

  const topUsersQuery = await db.select().from(users).orderBy(desc(users.createdAt)).limit(3);
  const topAuthors = topUsersQuery.map(u => ({
    id: u.id,
    name: u.displayName || u.username,
    username: u.username,
    avatarUrl: u.avatarUrl
  }));

  if (!session?.user?.id) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-3xl space-y-8">
          <div className="w-24 h-24 bg-[#1C4E41] rounded-full mx-auto flex items-center justify-center text-white mb-8">
            <BookOpen size={48} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-[#1C4E41] tracking-tight leading-tight">
            Kitobni o'qima. <br/> Undan fikr yarat.
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            O'zbekistondagi eng faol kitobxonlar hamjamiyatiga qo'shiling. O'qigan kitoblaringizni belgilang, xulosalar yozing va do'stlaringiz bilan baham ko'ring.
          </p>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto bg-[#1C4E41] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-[#153D32] transition-colors shadow-xl shadow-green-900/20">
              Bepul ro'yxatdan o'tish
            </Link>
            <Link href="/login" className="w-full sm:w-auto bg-white text-[#1C4E41] border-2 border-[#1C4E41] px-8 py-4 rounded-full text-lg font-bold hover:bg-green-50 transition-colors">
              Tizimga kirish
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] p-4 lg:p-8 flex flex-col lg:flex-row gap-8">
      
      {/* ----------------- LEFT MAIN CONTENT ----------------- */}
      <div className="flex-1 max-w-4xl space-y-10">
        
        {/* HERO CARD */}
        {heroBook ? (
          <section className="relative bg-[#1E3A2F] text-white rounded-3xl p-8 overflow-hidden shadow-xl flex flex-col sm:flex-row items-center gap-8">
            <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070')] bg-cover bg-center"></div>
            
            <div className="relative z-10 w-48 h-72 bg-[#f4e4c9] rounded-xl shadow-2xl flex-shrink-0 flex items-center justify-center border border-white/10 overflow-hidden">
               {heroBook.coverUrl ? (
                 <img src={heroBook.coverUrl} alt={heroBook.title} className="w-full h-full object-cover" />
               ) : (
                 <div className="text-center p-4 text-[#8b4513]">
                   <h3 className="text-2xl font-serif font-bold mb-2">{heroBook.title}</h3>
                   <p className="text-sm">{heroBook.authorId}</p>
                 </div>
               )}
            </div>
            
            <div className="relative z-10 flex-1">
              <div className="inline-block px-3 py-1 mb-4 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Ommabop kitob
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{heroBook.title}</h1>
              <p className="text-gray-300 text-lg mb-4">{heroBook.pageCount || 0} sahifa</p>
              
              <div className="flex items-center gap-2 mb-6">
                <span className="font-bold text-xl">4.8</span>
                <div className="flex text-yellow-400"><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} className="text-gray-500"/></div>
              </div>
              
              <p className="text-sm text-gray-300 mb-8 max-w-lg line-clamp-2">{heroBook.description}</p>
              
              <div className="flex flex-wrap gap-4">
                <Link href={`/books/${heroBook.id}`} className="bg-[#4CAF50] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#45a049] transition-colors">Batafsil ko'rish</Link>
              </div>
            </div>
          </section>
        ) : (
          <section className="bg-gray-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
            <h2 className="text-xl font-bold mb-2">Hali kitoblar yo'q</h2>
            <p className="text-gray-500 mb-4">Platformaga birinchi bo'lib kitob qo'shing!</p>
            <Link href="/books/new" className="bg-[#1C4E41] text-white px-6 py-3 rounded-xl font-bold">+ Yangi kitob</Link>
          </section>
        )}

        {/* TAVSIYALAR (RECOMMENDATIONS) */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Siz uchun tavsiya etamiz</h2>
            <button className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50"><ChevronRight size={20}/></button>
          </div>
          <div className="flex overflow-x-auto gap-6 pb-4 snap-x hide-scrollbar">
            {allBooks.length > 0 ? allBooks.map((book) => (
              <Link key={book.id} href={`/books/${book.id}`} className="min-w-[160px] max-w-[160px] snap-start group">
                <div className="aspect-[2/3] bg-gray-200 rounded-xl mb-3 overflow-hidden shadow-sm border border-gray-100">
                  {book.coverUrl ? (
                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full bg-[#1C4E41]/5 flex flex-col items-center justify-center p-4">
                      <span className="text-xs font-bold text-center text-[#1C4E41]/80">{book.title}</span>
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-sm leading-tight mb-1 text-gray-900 line-clamp-1">{book.title}</h3>
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-yellow-500" fill="currentColor"/>
                  <span className="text-xs text-gray-600 font-medium">4.5</span>
                </div>
              </Link>
            )) : (
              <p className="text-sm text-gray-500">Hali tavsiyalar yo'q. /search orqali kitob qo'shing.</p>
            )}
          </div>
        </section>

        {/* COMMUNITY FEED */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Hamjamiyatdagi eng yangi fikrlar</h2>
            <Link href="/community" className="text-sm text-gray-500 font-medium hover:text-[#1C4E41]">Barchasini ko'rish</Link>
          </div>
          <div className="space-y-4">
            {recentThoughts.length === 0 ? (
              <p className="text-sm text-gray-500">Hozircha hech kim fikr yozmadi.</p>
            ) : (
              recentThoughts.map(t => (
                <div key={t.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1C4E41] to-green-600 flex items-center justify-center text-white font-bold text-sm">
                         {t.authorName?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-gray-900">{t.authorName || "Foydalanuvchi"} <span className="text-gray-400 text-xs font-normal ml-1">@{t.authorUsername} • {t.createdAt?.toLocaleDateString()}</span></div>
                      </div>
                    </div>
                    {t.bookTitle && <span className="text-[10px] font-bold text-[#1C4E41] bg-green-50 px-2 py-1 rounded-full">{t.bookTitle}</span>}
                  </div>
                  <p className="text-gray-800 text-sm leading-relaxed mb-6">{t.content}</p>
                  
                  <div className="flex items-center gap-6 text-gray-500 border-t border-gray-50 pt-4">
                    <button className="flex items-center gap-2 text-xs font-medium hover:text-red-500 transition-colors"><Heart size={16}/> 0</button>
                    <button className="flex items-center gap-2 text-xs font-medium hover:text-[#1C4E41] transition-colors"><MessageSquare size={16}/> 0</button>
                    <button className="flex items-center gap-2 text-xs font-medium hover:text-gray-900 transition-colors"><Share2 size={16}/> Ulashish</button>
                    <button className="flex items-center gap-2 text-xs font-medium hover:text-gray-900 transition-colors ml-auto"><Bookmark size={16}/> Saqlash</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* ----------------- RIGHT SIDEBAR (STATS) ----------------- */}
      <aside className="hidden lg:block w-80 space-y-8">
        
        {/* Progress Widget */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
             <h3 className="font-bold text-gray-900">O'qish jarayoningiz</h3>
             <span className="text-[10px] text-gray-500 cursor-pointer hover:text-[#1C4E41]">Barchasini ko'rish</span>
          </div>
          <div className="flex gap-4 mb-4">
            <div className="w-16 h-24 bg-[#f4e4c9] rounded-lg shadow-sm border border-gray-100 flex-shrink-0 flex items-center justify-center text-center p-2 text-[#8b4513] text-[10px] font-bold">
              Atomic Habits
            </div>
            <div className="flex-1 py-2">
              <h4 className="font-bold text-sm text-gray-900">Atomic Habits</h4>
              <p className="text-xs text-gray-500 mb-4">James Clear</p>
              <div className="flex items-center justify-between text-xs font-bold text-gray-900 mb-1">
                <span>Sahifa 173 / 256</span>
                <span>67%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                <div className="bg-[#1C4E41] h-1.5 rounded-full" style={{width: '67%'}}></div>
              </div>
            </div>
          </div>
          <button className="w-full bg-[#1C4E41] text-white py-2 rounded-xl text-sm font-semibold hover:bg-[#153D32] transition-colors">Davom ettirish</button>
        </div>

        {/* Stats Widget */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
             <h3 className="font-bold text-gray-900">O'qish statistikasi</h3>
             <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded">Bu oy</span>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-6 text-center">
            <div>
              <p className="text-xl font-bold text-gray-900 mb-1">{stats.read}</p>
              <p className="text-[10px] text-gray-500 font-medium">Kitob o'qildi</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900 mb-1">{stats.thoughts}</p>
              <p className="text-[10px] text-gray-500 font-medium">Fikr yozildi</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900 mb-1">{stats.likes}</p>
              <p className="text-[10px] text-gray-500 font-medium">Izoh yozildi</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-orange-50 p-3 rounded-xl border border-orange-100 text-sm">
            <span className="text-xl">🔥</span>
            <div>
              <p className="font-bold text-orange-900 leading-none">12 Kunlik seriya</p>
            </div>
          </div>
        </div>

        {/* Top Authors */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
             <h3 className="font-bold text-gray-900">Top mualliflar</h3>
             <span className="text-[10px] text-gray-500 cursor-pointer hover:text-[#1C4E41]">Barchasini ko'rish</span>
          </div>
          <div className="space-y-4">
             {topAuthors.map((author, i) => (
               <div key={author.id} className="flex items-center justify-between">
                 <Link href={`/profile`} className="flex items-center gap-3 group">
                   <div className="w-10 h-10 bg-gradient-to-br from-[#1C4E41] to-green-600 rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
                     {author.avatarUrl ? <img src={author.avatarUrl} className="w-full h-full object-cover" /> : author.name.charAt(0).toUpperCase()}
                   </div>
                   <div>
                     <p className="font-bold text-sm text-gray-900 group-hover:text-[#1C4E41] transition-colors">{author.name}</p>
                     <p className="text-[10px] text-gray-500">@{author.username}</p>
                   </div>
                 </Link>
                 <FollowButton targetUserId={author.id} />
               </div>
             ))}
          </div>
        </div>

      </aside>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </main>
  );
}

function BookOpen(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  )
}
