import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { userBooks, books } from "@/db/schema"
import { eq } from "drizzle-orm"
import Link from "next/link"
import { Clock, BookOpen, CheckCircle, PauseCircle, XCircle } from "lucide-react"

export default async function ProgressPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const myBooks = await db.select({
    status: userBooks.status,
    bookId: books.id,
    bookTitle: books.title,
    coverUrl: books.coverUrl,
    pageCount: books.pageCount,
    currentPage: userBooks.currentPage
  }).from(userBooks)
    .innerJoin(books, eq(userBooks.bookId, books.id))
    .where(eq(userBooks.userId, session.user.id))

  const reading = myBooks.filter(b => b.status === "reading")
  const wantToRead = myBooks.filter(b => b.status === "want_to_read")
  const finished = myBooks.filter(b => b.status === "finished")

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 min-h-screen">
      <h1 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
        <Clock className="text-[#1C4E41]" /> O'qish jarayoni
      </h1>
      
      {myBooks.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center border border-gray-100 shadow-sm">
          <BookOpen size={48} className="mx-auto text-gray-200 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Kutubxonangiz bo'sh</h2>
          <p className="text-gray-500 mb-6">O'qishni boshlash uchun kitob qo'shing.</p>
          <Link href="/search" className="bg-[#1C4E41] text-white px-6 py-3 rounded-xl font-bold">
            Kitob qidirish
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          
          {/* O'qiyapman */}
          {reading.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><BookOpen className="text-[#1C4E41]" size={20}/> Hozir o'qilyotganlar</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reading.map((b, i) => (
                  <Link key={i} href={`/books/${b.bookId}`} className="bg-white p-4 rounded-2xl flex gap-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-16 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                      {b.coverUrl && <img src={b.coverUrl} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 py-1">
                      <h3 className="font-bold text-gray-900 leading-tight mb-2 line-clamp-2">{b.bookTitle}</h3>
                      <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                         <div className="bg-[#1C4E41] h-2 rounded-full" style={{ width: `${b.pageCount ? Math.min(100, Math.floor(((b.currentPage || 0) / b.pageCount) * 100)) : 10}%` }}></div>
                      </div>
                      <p className="text-xs text-gray-500 font-semibold">{b.currentPage || 0} / {b.pageCount || "?"} sahifa</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* O'qimoqchiman */}
          {wantToRead.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Clock className="text-yellow-500" size={20}/> Navbatdagi kitoblar</h2>
              <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
                {wantToRead.map((b, i) => (
                  <Link key={i} href={`/books/${b.bookId}`} className="min-w-[120px] max-w-[120px] snap-start">
                    <div className="aspect-[2/3] bg-gray-200 rounded-xl mb-2 overflow-hidden shadow-sm">
                      {b.coverUrl && <img src={b.coverUrl} className="w-full h-full object-cover" />}
                    </div>
                    <h3 className="font-bold text-xs leading-tight line-clamp-2">{b.bookTitle}</h3>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Tugatdim */}
          {finished.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><CheckCircle className="text-green-500" size={20}/> O'qib tugatilganlar</h2>
              <div className="flex flex-wrap gap-3">
                {finished.map((b, i) => (
                  <Link key={i} href={`/books/${b.bookId}`} className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-semibold hover:border-[#1C4E41] transition-colors">
                    {b.bookTitle}
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      )}
    </div>
  )
}
