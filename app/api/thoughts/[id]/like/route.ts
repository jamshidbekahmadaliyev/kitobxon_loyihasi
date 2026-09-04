import { NextResponse } from "next/server";
import { db } from "@/db";
import { likes } from "@/db/schema";
import { auth } from "@/auth";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Ruxsat etilmagan" }, { status: 401 });
    }
    
    const { id } = await params;

    const existingLike = await db.select().from(likes).where(
      and(eq(likes.userId, session.user.id), eq(likes.thoughtId, id))
    );

    if (existingLike.length > 0) {
      // Unlike
      await db.delete(likes).where(eq(likes.id, existingLike[0].id));
      return NextResponse.json({ liked: false }, { status: 200 });
    } else {
      // Like
      await db.insert(likes).values({
        id: uuidv4(),
        userId: session.user.id,
        thoughtId: id,
      });
      return NextResponse.json({ liked: true }, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}
