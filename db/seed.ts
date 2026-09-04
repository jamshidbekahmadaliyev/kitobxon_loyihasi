import "dotenv/config";
import { db } from "./index";
import { users, books } from "./schema";

async function main() {
  console.log("Seeding database...");
  
  await db.insert(users).values([
    {
      id: "user_1",
      username: "alisher_navoiy",
      displayName: "Alisher Navoiy",
      bio: "O'zbek adabiyoti gultoji",
    },
    {
      id: "user_2",
      username: "kitobxon_uz",
      displayName: "Kitobxon Uz",
      bio: "Kitoblar olamiga sayohat",
    }
  ]).onConflictDoNothing();

  await db.insert(books).values([
    {
      id: "book_1",
      title: "O'tkan kunlar",
      authorId: "user_1",
      description: "Abdulla Qodiriyning eng mashhur romani.",
      pageCount: 400,
    },
    {
      id: "book_2",
      title: "Atom odatlar",
      authorId: "user_2",
      description: "Kichik odatlar katta natijalarga olib kelishi haqida.",
      pageCount: 320,
    }
  ]).onConflictDoNothing();

  console.log("Seeding complete!");
}

main().catch(console.error);
