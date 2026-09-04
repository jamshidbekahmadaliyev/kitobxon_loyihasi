import { Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ComingSoon({ title, description }: { title: string, description: string }) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-[#EAF3EF] text-[#1C4E41] rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock size={48} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-500 font-medium mb-8 leading-relaxed">
          {description} Ushbu funksiya ustida qizg'in ish olib boryapmiz. Tez kunda tayyor bo'ladi!
        </p>
        <Link href="/" className="inline-flex items-center gap-2 bg-[#1C4E41] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#153D32] transition-colors">
           <ArrowLeft size={18} /> Orqaga qaytish
        </Link>
      </div>
    </div>
  )
}
