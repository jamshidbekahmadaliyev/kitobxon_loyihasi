import { auth } from "@/auth";
import { db } from "@/db";
import { users, books, thoughts } from "@/db/schema";
import { redirect } from "next/navigation";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export default async function AdminDashboard() {
  const session = await auth();
  
  // Faqat 'admin' username'iga ega foydalanuvchi kira oladi
  if (!session?.user?.id) redirect("/login");
  const [currentUser] = await db.select().from(users).where(eq(users.id, session.user.id));
  
  if (currentUser?.username !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-[#FDFBF7]">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl max-w-md text-center">
          <h2 className="text-xl font-bold mb-2">Kirish taqiqlangan!</h2>
          <p>Sizda admin huquqlari yo'q. Faqatgina "admin" akkaunti bu yerga kira oladi.</p>
          <a href="/" className="mt-4 inline-block underline">Asosiy sahifaga qaytish</a>
        </div>
      </div>
    );
  }

  // Barcha ma'lumotlarni olish
  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
  const allBooks = await db.select().from(books).orderBy(desc(books.createdAt));
  const allThoughts = await db.select({
    id: thoughts.id,
    content: thoughts.content,
    authorName: users.username,
    bookTitle: books.title,
    createdAt: thoughts.createdAt,
  }).from(thoughts)
    .leftJoin(users, eq(thoughts.userId, users.id))
    .leftJoin(books, eq(thoughts.bookId, books.id))
    .orderBy(desc(thoughts.createdAt));

  // Server Actions for deletion
  async function deleteBook(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await db.delete(books).where(eq(books.id, id));
    revalidatePath("/admin");
  }

  async function deleteThought(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await db.delete(thoughts).where(eq(thoughts.id, id));
    revalidatePath("/admin");
  }

  async function deleteUser(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if(id === currentUser.id) return; // O'zini o'chira olmaydi
    await db.delete(users).where(eq(users.id, id));
    revalidatePath("/admin");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 pb-24">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-500">Tizimni to'liq boshqarish</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium mb-1">Foydalanuvchilar</h3>
            <p className="text-3xl font-bold text-[#1C4E41]">{allUsers.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium mb-1">Kitoblar</h3>
            <p className="text-3xl font-bold text-[#1C4E41]">{allBooks.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium mb-1">Yozilgan fikrlar</h3>
            <p className="text-3xl font-bold text-[#1C4E41]">{allThoughts.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fikrlar moderatsiyasi */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">So'nggi fikrlar (Moderatsiya)</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {allThoughts.map(t => (
                <div key={t.id} className="p-4 bg-gray-50 rounded-xl flex justify-between gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">@{t.authorName} • "{t.bookTitle}"</p>
                    <p className="text-sm font-medium">{t.content}</p>
                  </div>
                  <form action={deleteThought}>
                    <input type="hidden" name="id" value={t.id} />
                    <button type="submit" className="text-red-500 hover:bg-red-100 p-2 rounded-lg text-xs font-bold transition-colors">O'chirish</button>
                  </form>
                </div>
              ))}
            </div>
          </div>

          {/* Kitoblar bazasi */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Kitoblar bazasi</h2>
              <a href="/books/new" className="text-sm text-[#1C4E41] hover:underline">+ Yangi qo'shish</a>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {allBooks.map(b => (
                <div key={b.id} className="p-4 border border-gray-100 rounded-xl flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold">{b.title}</p>
                    <p className="text-xs text-gray-500">{b.pageCount} sahifa</p>
                  </div>
                  <form action={deleteBook}>
                    <input type="hidden" name="id" value={b.id} />
                    <button type="submit" className="text-red-500 hover:bg-red-50 p-2 rounded-lg text-xs font-bold">O'chirish</button>
                  </form>
                </div>
              ))}
            </div>
          </div>
          
          {/* Foydalanuvchilar */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
            <h2 className="text-xl font-bold mb-4">Foydalanuvchilar</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 text-gray-500 font-medium">Username</th>
                    <th className="pb-3 text-gray-500 font-medium">Ism</th>
                    <th className="pb-3 text-gray-500 font-medium text-right">Harakat</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map(u => (
                    <tr key={u.id} className="border-b last:border-0">
                      <td className="py-3 font-medium">@{u.username} {u.username === "admin" && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full ml-2">Admin</span>}</td>
                      <td className="py-3 text-gray-600">{u.displayName || "-"}</td>
                      <td className="py-3 text-right">
                        {u.username !== "admin" && (
                          <form action={deleteUser}>
                            <input type="hidden" name="id" value={u.id} />
                            <button type="submit" className="text-red-500 hover:underline">Bloklash</button>
                          </form>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
