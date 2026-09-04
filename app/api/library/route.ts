import { NextResponse } from "next/server";
import { db } from "@/db";
import { userBooks } from "@/db/schema";
import { auth } from "@/auth";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Ruxsat etilmagan" }, { status: 401 });
    }

    const { bookId, status } = await req.json();
    if (!bookId || !status) {
      return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });
    }

    const existingRecord = await db.select().from(userBooks).where(
      and(eq(userBooks.userId, session.user.id), eq(userBooks.bookId, bookId))
    );

    if (existingRecord.length > 0) {
      await db.update(userBooks).set({ status }).where(eq(userBooks.id, existingRecord[0].id));
    } else {
      await db.insert(userBooks).values({
        id: uuidv4(),
        userId: session.user.id,
        bookId,
        status,
        startedAt: status === "reading" ? new Date() : undefined,
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}
