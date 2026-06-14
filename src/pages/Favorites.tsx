import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { schools } from "../data/schools";
import type { School } from "../data/schools";
import SchoolCard from "../components/SchoolCard";
import SchoolDetail from "../components/SchoolDetail";
import ShareButton from "../components/ShareButton";

export default function Favorites() {
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch {
      return [];
    }
  });
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  const favoriteSchools = schools.filter((s) => favorites.includes(s.id));

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const next = prev.filter((f) => f !== id);
      localStorage.setItem("favorites", JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Helmet>
        <title>我的收藏 — 美高选校助手</title>
        <meta name="description" content="查看你收藏的美国寄宿高中。" />
      </Helmet>

      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-gray-900">我的收藏</h1>
        <ShareButton url={window.location.origin + "/favorites"} label="Share Favorites" />
      </div>
      <p className="text-gray-500 mb-8">
        你收藏了 {favoriteSchools.length} 所学校
      </p>

      {favoriteSchools.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">💝</p>
          <p className="text-lg">还没有收藏任何学校</p>
          <p className="text-sm mt-2">
            去学校库或智能选校页面，点击 🤍 收藏感兴趣的学校
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteSchools.map((school) => (
            <SchoolCard
              key={school.id}
              school={school}
              onClick={() => setSelectedSchool(school)}
              isFavorited={true}
              onToggleFavorite={() => toggleFavorite(school.id)}
            />
          ))}
        </div>
      )}

      {selectedSchool && (
        <SchoolDetail
          school={selectedSchool}
          onClose={() => setSelectedSchool(null)}
        />
      )}
    </div>
  );
}
