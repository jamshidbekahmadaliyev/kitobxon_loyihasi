import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { r2 } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Ruxsat etilmagan" }, { status: 401 });
    }

    const { filename, contentType } = await req.json();
    if (!filename || !contentType) {
      return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });
    }

    const ext = filename.split('.').pop();
    const key = `uploads/${session.user.id}/${uuidv4()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(r2, command, { expiresIn: 3600 });
    
    // The public URL assuming you set up a custom domain or public bucket routing in Cloudflare
    const publicUrl = `https://cdn.kitobxon.uz/${key}`; // Placeholder domain

    return NextResponse.json({ signedUrl, publicUrl, key }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}
