import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { username, password, displayName } = await req.json();
    
    if (!username || !password) {
      return NextResponse.json({ error: "Barcha maydonlarni to'ldiring" }, { status: 400 });
    }

    const existingUser = await db.select().from(users).where(eq(users.username, username));
    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Foydalanuvchi nomi band" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const id = uuidv4();

    await db.insert(users).values({
      id,
      username,
      passwordHash,
      displayName,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}
