import { auth } from "@/auth"
import { db } from "@/db"
import { books } from "@/db/schema"
import { redirect } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import { sql } from "drizzle-orm"

export default async function NewBookPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const { error } = await searchParams;

  async function createBook(formData: FormData) {
    "use server"
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const authorId = formData.get("author") as string
    const coverUrl = formData.get("coverUrl") as string
    const pageCount = parseInt(formData.get("pageCount") as string) || 0

    if (!title) return

    // Tekshiramiz: Bunday nomli kitob bazada bormi?
    const existingBooks = await db.select().from(books).where(
      sql`LOWER(${books.title}) = LOWER(${title})`
    );

    if (existingBooks.length > 0) {
      // Agar mavjud bo'lsa, xato qaytaramiz
      redirect("/books/new?error=exists")
    }

    const id = uuidv4()
    await db.insert(books).values({
      id,
      title,
      description,
      authorId,
      coverUrl,
      pageCount,
    })

    redirect(`/books/${id}`)
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <a href="/search" className="text-[#1C4E41] hover:underline flex items-center gap-2">
            ← Ortga
          </a>
          <h1 className="text-2xl font-bold tracking-tight text-[#1C4E41]">Yangi kitob qo'shish</h1>
        </header>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-gray-600 mb-6 font-medium">
            Qidirayotgan kitobingizni topa olmadingizmi? Uni o'zingiz qo'shing va boshqalar bilan baham ko'ring!
          </p>
          
          {error === "exists" && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium border border-red-100 flex items-center gap-3">
              <span>⚠️</span> Ushbu nomdagi kitob allaqachon mavjud! Iltimos, kitoblar ro'yxatidan qidirib ko'ring yoki boshqa nom kiriting.
            </div>
          )}

          <form action={createBook} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Kitob nomi *</label>
              <input type="text" name="title" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1C4E41]/50 focus:border-[#1C4E41] transition-all" placeholder="Masalan: O'tkan kunlar" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Muallif (Yozuvchi) *</label>
              <input type="text" name="author" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1C4E41]/50 focus:border-[#1C4E41] transition-all" placeholder="Masalan: Abdulla Qodiriy" />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Kitob rasmi (URL)</label>
              <input type="url" name="coverUrl" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1C4E41]/50 focus:border-[#1C4E41] transition-all" placeholder="https://example.com/rasm.jpg" />
              <p className="text-xs text-gray-500 mt-1">Kitob muqovasi uchun internetdagi rasm havolasini (link) joylang.</p>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Qisqacha tavsif</label>
              <textarea name="description" rows={4} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1C4E41]/50 focus:border-[#1C4E41] transition-all" placeholder="Kitob haqida qisqacha ma'lumot..."></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Sahifalar soni</label>
              <input type="number" name="pageCount" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1C4E41]/50 focus:border-[#1C4E41] transition-all" placeholder="Masalan: 400" />
            </div>

            <button type="submit" className="w-full bg-[#1C4E41] text-white p-4 rounded-xl hover:bg-[#153D32] transition-colors font-bold mt-2 shadow-lg shadow-green-900/20">
              Kitobni saqlash
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
