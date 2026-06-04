import { useState, useMemo } from "react";
import { schools, regions, tuitionRanges, allTags } from "../data/schools";
import type { School } from "../data/schools";
import SchoolCard from "../components/SchoolCard";
import SchoolDetail from "../components/SchoolDetail";

export default function SchoolList() {
  const [region, setRegion] = useState("全部");
  const [tier, setTier] = useState("全部");
  const [tuitionRange, setTuitionRange] = useState(0);
  const [sortBy, setSortBy] = useState<"ranking" | "tuition" | "acceptance">(
    "ranking"
  );
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch {
      return [];
    }
  });
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const next = prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id];
      localStorage.setItem("favorites", JSON.stringify(next));
      return next;
    });
  };

  const filtered = useMemo(() => {
    let result = [...schools];

    // 搜索筛选
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (s) =>
          s.nameCn.includes(q) ||
          s.name.toLowerCase().includes(q) ||
          s.state.includes(q) ||
          s.city.toLowerCase().includes(q)
      );
    }

    // 地区筛选
    if (region !== "全部") {
      result = result.filter((s) => s.region === region);
    }

    // 梯队筛选
    if (tier !== "全部") {
      result = result.filter((s) => s.rankingTier === tier);
    }

    // 学费筛选
    const range = tuitionRanges[tuitionRange];
    if (tuitionRange > 0) {
      result = result.filter(
        (s) => s.tuition >= range.min && s.tuition < range.max
      );
    }

    // 标签筛选
    if (selectedTag) {
      result = result.filter((s) => s.tags.includes(selectedTag));
    }

    // 排序
    result.sort((a, b) => {
      if (sortBy === "ranking") return a.ranking - b.ranking;
      if (sortBy === "tuition") return a.tuition - b.tuition;
      return a.acceptanceRate - b.acceptanceRate;
    });

    return result;
  }, [search, region, tier, tuitionRange, selectedTag, sortBy]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">学校库</h1>
      <p className="text-gray-500 mb-8">
        共收录 {schools.length} 所热门美国寄宿高中
      </p>

      {/* 搜索框 */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 搜索学校名称、地区..."
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm"
        />
      </div>

      {/* 筛选栏 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              地区
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option>全部</option>
              {regions.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              梯队
            </label>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option>全部</option>
              <option>顶尖</option>
              <option>优秀</option>
              <option>热门</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              学费
            </label>
            <select
              value={tuitionRange}
              onChange={(e) => setTuitionRange(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              {tuitionRanges.map((r, i) => (
                <option key={i} value={i}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              排序
            </label>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "ranking" | "tuition" | "acceptance")
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="ranking">按排名</option>
              <option value="tuition">按学费（低→高）</option>
              <option value="acceptance">按录取率（高→低）</option>
            </select>
          </div>
        </div>
      </div>

      {/* 标签筛选 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          🏷️ 按特色筛选
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag("")}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedTag === ""
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            全部
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedTag === tag
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 结果 */}
      <p className="text-sm text-gray-500 mb-4">
        找到 {filtered.length} 所学校
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-4">🏫</p>
          <p>没有符合条件的学校，请调整筛选条件</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((school) => (
            <SchoolCard
              key={school.id}
              school={school}
              onClick={() => setSelectedSchool(school)}
              isFavorited={favorites.includes(school.id)}
              onToggleFavorite={() => toggleFavorite(school.id)}
            />
          ))}
        </div>
      )}

      {/* 详情弹窗 */}
      {selectedSchool && (
        <SchoolDetail
          school={selectedSchool}
          onClose={() => setSelectedSchool(null)}
        />
      )}
    </div>
  );
}
