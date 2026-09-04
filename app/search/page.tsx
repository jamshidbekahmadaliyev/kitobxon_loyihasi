import { db } from "@/db";
import { books } from "@/db/schema";
import { like } from "drizzle-orm";
import { auth } from "@/auth";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const query = params.q || "";
  const session = await auth();

  let results: any[] = [];
  if (query.trim()) {
    results = await db.select().from(books).where(like(books.title, `%${query}%`));
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#1C4E41]">Katalog</h1>
          <a href="/books/new" className="bg-[#1C4E41] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#153D32] transition-colors">+ Yangi kitob</a>
        </div>

        <form method="GET" action="/search" className="mb-8 flex gap-4">
          <input 
            type="text" 
            name="q" 
            defaultValue={query} 
            placeholder="Kitob yoki muallif qidirish..."
            className="flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1C4E41]"
          />
          <button type="submit" className="bg-[#1C4E41] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#153D32] transition-colors">Qidirish</button>
        </form>

        {query && (
          <div>
            <h2 className="text-lg font-bold mb-4">Natijalar: {results.length} ta</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map(book => (
                <a key={book.id} href={`/books/${book.id}`} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow block">
                  <div className="aspect-[2/3] bg-gray-100 rounded-lg mb-4"></div>
                  <h3 className="font-bold text-lg leading-tight mb-1">{book.title}</h3>
                  <p className="text-sm line-clamp-3 text-gray-700">{book.description}</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
