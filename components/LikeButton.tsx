"use client";
import { useState } from "react";
import { Heart } from "lucide-react";

export default function LikeButton({ thoughtId, initialLiked = false, count = 0 }: { thoughtId: string, initialLiked?: boolean, count?: number }) {
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(count);

  const toggleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    // TODO: Connect to backend Server Action when ready
  };

  return (
    <button 
      onClick={toggleLike}
      className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
        liked 
        ? "bg-red-50 text-red-500 border border-red-100" 
        : "text-gray-500 hover:bg-gray-100 border border-transparent"
      }`}
    >
      <Heart size={16} className={liked ? "fill-current" : ""} /> 
      {likesCount} {likesCount > 0 ? "ta yoqdi" : ""}
    </button>
  );
}
