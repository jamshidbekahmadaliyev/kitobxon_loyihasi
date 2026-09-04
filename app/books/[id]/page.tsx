import { db } from "@/db"
import { books, users, userBooks, thoughts } from "@/db/schema"
import { eq, and, desc } from "drizzle-orm"
import { notFound } from "next/navigation"
import { auth } from "@/auth"
import Link from "next/link"
import LibraryButton from "@/components/LibraryButton"
import ThoughtForm from "@/components/ThoughtForm"
import LikeButton from "@/components/LikeButton"
import { Star, Clock, BookOpen, MessageSquare, Share2, Quote, TrendingUp, ChevronLeft } from "lucide-react"

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const { id } = await params;
  const [book] = await db.select().from(books).where(eq(books.id, id))
  
  if (!book) {
    notFound()
  }

  const bookThoughts = await db.select({
    id: thoughts.id,
    content: thoughts.content,
    containsSpoiler: thoughts.containsSpoiler,
    createdAt: thoughts.createdAt,
    authorName: users.displayName,
    authorUsername: users.username
  }).from(thoughts)
    .leftJoin(users, eq(thoughts.userId, users.id))
    .where(eq(thoughts.bookId, book.id))
    .orderBy(desc(thoughts.createdAt))

  let currentStatus = undefined
  if (session?.user?.id) {
    const [record] = await db.select().from(userBooks).where(
      and(eq(userBooks.userId, session.user.id), eq(userBooks.bookId, book.id))
    )
    if (record) currentStatus = record.status
  }

  let authorName = "Noma'lum muallif"
  if (book.authorId) {
    const [author] = await db.select().from(users).where(eq(users.id, book.authorId))
    if (author) authorName = author.displayName || author.username
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      
      {/* Dynamic Header Section */}
      <div className="relative bg-[#1C4E41] pt-12 pb-32 px-4 md:px-8 overflow-hidden rounded-b-[3rem]">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2000')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C4E41] to-transparent"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <Link href="/search" className="inline-flex items-center gap-2 text-green-100 hover:text-white transition-colors mb-8 font-medium">
            <ChevronLeft size={20} /> Orqaga qaytish
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* We removed the huge frame and instead use a small elegant cover if available, or just icon */}
            <div className="w-32 h-48 bg-[#EAF3EF] rounded-xl shadow-2xl flex-shrink-0 flex items-center justify-center border-4 border-white/20 transform -rotate-3 overflow-hidden">
               {book.coverUrl ? (
                 <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
               ) : (
                 <BookOpen size={40} className="text-[#1C4E41]/30" />
               )}
            </div>
            
            <div className="flex-1 text-white">
              <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 backdrop-blur-sm">
                Asar
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-2 leading-tight">{book.title}</h1>
              <p className="text-xl text-green-100 font-medium mb-6">{authorName}</p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-green-50 mb-8">
                <div className="flex items-center gap-2">
                  <Star size={18} className="text-yellow-400" fill="currentColor"/> 
                  <span className="text-white text-lg font-bold">4.8</span> <span className="text-green-200">(Yaxshi baholangan)</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-green-300"/>
                  {book.pageCount || 0} sahifa
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare size={18} className="text-green-300"/>
                  {bookThoughts.length} ta fikr
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <LibraryButton bookId={book.id} currentStatus={currentStatus} />
                <a href="#fikr-yozish" className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-3 rounded-xl font-bold transition-all backdrop-blur-md flex items-center gap-2">
                  <Quote size={18} /> O'z fikrimni yozish
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 -mt-20 relative z-20 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-8">
            
            {/* About Book */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                Kitob haqida
              </h2>
              <p className="text-gray-700 leading-loose text-lg font-serif">
                {book.description || "Ushbu asar haqida batafsil ma'lumot kiritilmagan. Lekin siz u haqida o'z xulosalaringizni yozib, qolganlarga yordam berishingiz mumkin!"}
              </p>
            </div>
            
            {/* Thoughts Section */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="text-[#1C4E41]" size={24}/> Kitobxonlar nima deydi?
                </h2>
                <span className="bg-green-50 text-[#1C4E41] px-3 py-1 rounded-full text-sm font-bold">{bookThoughts.length} ta fikr</span>
              </div>
              
              <div className="space-y-6">
                {bookThoughts.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <Quote size={40} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Bu kitob haqida hali hech kim fikr yozmadi.</p>
                    <p className="text-sm text-gray-400 mt-1">Tarixda birinchi bo'lib o'z izingizni qoldiring!</p>
                  </div>
                ) : (
                  bookThoughts.map(thought => (
                    <div key={thought.id} className="p-6 rounded-2xl bg-[#FDFBF7] border border-[#EAF3EF] transition-all hover:shadow-md relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-[#1C4E41] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#1C4E41] to-green-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                            {thought.authorName?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{thought.authorName}</div>
                            <div className="text-xs text-gray-500 font-medium">@{thought.authorUsername} • {thought.createdAt?.toLocaleDateString()}</div>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-[#1C4E41] transition-colors"><Share2 size={16}/></button>
                      </div>
                      
                      {thought.containsSpoiler ? (
                        <details className="cursor-pointer group mb-2 bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                          <summary className="text-sm font-bold text-yellow-700 hover:text-yellow-800 flex items-center gap-2">
                            ⚠️ Spoiler mavjud! O'qish uchun bosing.
                          </summary>
                          <p className="text-gray-800 leading-relaxed font-serif mt-3 pt-3 border-t border-yellow-200">{thought.content}</p>
                        </details>
                      ) : (
                        <p className="text-gray-800 leading-relaxed font-serif text-lg mb-2">"{thought.content}"</p>
                      )}
                      
                      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <LikeButton thoughtId={thought.id} initialLiked={false} count={Math.floor(Math.random() * 10)} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Write Review Form */}
            <div id="fikr-yozish" className="bg-gradient-to-br from-[#1C4E41] to-[#153D32] p-1 rounded-3xl shadow-lg">
              <div className="bg-white p-8 rounded-[22px]">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">O'z xulosangizni yozing</h2>
                <p className="text-gray-500 mb-6">Bu kitob sizga nima berdi? Qanday yangi g'oyalarni kashf qildingiz?</p>
                {session ? (
                  <ThoughtForm bookId={book.id} />
                ) : (
                  <div className="bg-gray-50 p-8 rounded-2xl text-center border border-gray-100">
                    <Quote size={48} className="text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-600 mb-6 font-medium text-lg">Xulosa yozish uchun avval tizimga kirishingiz kerak.</p>
                    <Link href="/login" className="bg-[#1C4E41] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#153D32] transition-transform hover:scale-105 inline-block shadow-lg shadow-green-900/20">
                      Tizimga kirish yoki Ro'yxatdan o'tish
                    </Link>
                  </div>
                )}
              </div>
            </div>

          </div>
          
          {/* Right Sidebar Widgets */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-[#1C4E41]"/> Qiziqarli faktlar
              </h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">1</div>
                  <p className="text-gray-600 leading-tight">Bu kitob butun dunyo bo'ylab eng ko'p muhokama qilingan asarlar qatoriga kiradi.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-50 text-green-500 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">2</div>
                  <p className="text-gray-600 leading-tight">Foydalanuvchilarimizning 85% i bu kitobni do'stlariga tavsiya qilgan.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">3</div>
                  <p className="text-gray-600 leading-tight">Ushbu asarni o'rtacha o'qib tugatish vaqti: 12 kun.</p>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#F5F9F7] to-[#EAF3EF] p-6 rounded-3xl border border-[#D1E6DD]">
               <h3 className="font-bold text-[#1C4E41] mb-2">Kitobxon kotirovkasi</h3>
               <p className="font-serif italic text-gray-700 leading-relaxed">
                 "Kitoblar aql uchun qanday bo'lsa, jism uchun mashq shundaydir."
               </p>
               <p className="text-xs font-bold text-right text-[#1C4E41] mt-2">— Jozef Addison</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
