"use client"
import { useEffect } from "react"

export default function TelegramInit() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      tg.setHeaderColor("#FDFBF7");
      tg.setBackgroundColor("#FDFBF7");
    }
  }, [])
  
  return null;
}
