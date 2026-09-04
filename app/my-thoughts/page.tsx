import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { thoughts, books } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import Link from "next/link"
import { MessageSquare, Quote, Heart } from "lucide-react"

export default async function MyThoughtsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const myThoughts = await db.select({
    id: thoughts.id,
    content: thoughts.content,
    createdAt: thoughts.createdAt,
    bookId: books.id,
    bookTitle: books.title
  }).from(thoughts)
    .leftJoin(books, eq(thoughts.bookId, books.id))
    .where(eq(thoughts.userId, session.user.id))
    .orderBy(desc(thoughts.createdAt))

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 min-h-screen">
      <h1 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
        <MessageSquare className="text-[#1C4E41]" /> Mening fikrlarim
      </h1>
      
      {myThoughts.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center border border-gray-100 shadow-sm">
          <Quote size={48} className="mx-auto text-gray-200 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Hali hech qanday fikr yozmadingiz</h2>
          <p className="text-gray-500 mb-6">O'qigan kitoblaringiz haqida xulosa yozishni boshlang.</p>
          <Link href="/search" className="bg-[#1C4E41] text-white px-6 py-3 rounded-xl font-bold">
            Kitob qidirish
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {myThoughts.map(t => (
            <div key={t.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
               <div className="flex justify-between items-center mb-4">
                 <Link href={`/books/${t.bookId}`} className="font-bold text-[#1C4E41] hover:underline bg-green-50 px-3 py-1 rounded-lg text-sm">
                   {t.bookTitle}
                 </Link>
                 <span className="text-xs text-gray-400 font-medium">{t.createdAt?.toLocaleDateString()}</span>
               </div>
               <p className="text-gray-800 font-serif leading-relaxed text-lg mb-4">"{t.content}"</p>
               <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 pt-4 border-t border-gray-50">
                 <span className="flex items-center gap-1"><Heart size={14}/> 0 ta yoqdi</span>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
