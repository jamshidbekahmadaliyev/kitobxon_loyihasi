"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FollowButton({ targetUserId, initialFollowing = false }: { targetUserId: string, initialFollowing?: boolean }) {
  const [following, setFollowing] = useState(initialFollowing);
  const router = useRouter();

  const toggleFollow = () => {
    setFollowing(!following);
    // TODO: Connect to backend Server Action when ready to insert into follows table
  };

  return (
    <button 
      onClick={toggleFollow}
      className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-colors ${
        following 
        ? "bg-gray-100 text-gray-600 border border-gray-200" 
        : "text-[#1C4E41] bg-green-50 border border-[#1C4E41]/20 hover:bg-green-100"
      }`}
    >
      {following ? "Kuzatilmoqda" : "Kuzatish"}
    </button>
  );
}
