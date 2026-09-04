import { db } from "@/db"
import { thoughts, users, books } from "@/db/schema"
import { desc, eq } from "drizzle-orm"
import { auth } from "@/auth"

import LikeButton from "@/components/LikeButton"

export default async function CommunityPage() {
  const session = await auth()

  const feedThoughts = await db.select({
    id: thoughts.id,
    content: thoughts.content,
    containsSpoiler: thoughts.containsSpoiler,
    createdAt: thoughts.createdAt,
    authorName: users.displayName,
    authorUsername: users.username,
    bookTitle: books.title,
    bookId: books.id,
  }).from(thoughts)
    .innerJoin(users, eq(thoughts.userId, users.id))
    .innerJoin(books, eq(thoughts.bookId, books.id))
    .orderBy(desc(thoughts.createdAt))
    .limit(20)

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1C4E41] mb-6">Hamjamiyat fikrlari</h1>

        <div className="space-y-6">
          {feedThoughts.length === 0 ? (
            <p className="text-gray-500">Hali hech kim fikr yozmagan.</p>
          ) : (
            feedThoughts.map(thought => (
              <div key={thought.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="font-medium text-[#1C4E41]">{thought.authorName}</div>
                    <div className="text-xs text-gray-500">@{thought.authorUsername} • {thought.createdAt?.toLocaleDateString()}</div>
                  </div>
                </div>
                
                <a href={`/books/${thought.bookId}`} className="inline-block mb-3 px-3 py-1 bg-gray-100 text-xs font-medium text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                  📚 {thought.bookTitle}
                </a>

                {thought.containsSpoiler ? (
                  <details className="cursor-pointer group mb-4">
                    <summary className="text-sm font-medium text-[#D4AF37] mb-2 hover:underline">Spoiler mavjud. Ko'rish uchun bosing.</summary>
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{thought.content}</p>
                  </details>
                ) : (
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap mb-4">{thought.content}</p>
                )}
                
                <div className="border-t border-gray-100 pt-4 mt-2">
                  <LikeButton thoughtId={thought.id} initialLiked={false} count={0} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
