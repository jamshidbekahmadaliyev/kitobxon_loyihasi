import { NextResponse } from "next/server";
import { db } from "@/db";
import { thoughts } from "@/db/schema";
import { auth } from "@/auth";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Ruxsat etilmagan" }, { status: 401 });
    }

    const { bookId, content, containsSpoiler } = await req.json();
    if (!bookId || !content) {
      return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });
    }

    await db.insert(thoughts).values({
      id: uuidv4(),
      userId: session.user.id,
      bookId,
      content,
      containsSpoiler: containsSpoiler || false,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}
