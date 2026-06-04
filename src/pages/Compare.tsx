import { useState, useMemo } from "react";
import { schools } from "../data/schools";
import type { School } from "../data/schools";

const compareFields = [
  { label: "排名", key: "ranking", format: (v: number) => `#${v}` },
  { label: "梯队", key: "rankingTier", format: (v: string) => v },
  {
    label: "年学费",
    key: "tuition",
    format: (v: number) => `$${v.toLocaleString()}`,
  },
  { label: "录取率", key: "acceptanceRate", format: (v: number) => `${v}%` },
  {
    label: "国际生比例",
    key: "internationalRate",
    format: (v: number) => `${v}%`,
  },
  { label: "建议托福", key: "toeflMin", format: (v: number) => `${v}+` },
  {
    label: "建议 SSAT",
    key: "ssatPercentile",
    format: (v: number) => `${v}%+`,
  },
  { label: "建议 GPA", key: "gpaMin", format: (v: number) => `${v}+` },
  { label: "学生总数", key: "studentCount", format: (v: number) => `${v} 人` },
  { label: "师生比", key: "studentTeacherRatio", format: (v: string) => v },
  { label: "年级范围", key: "grades", format: (v: string) => v },
  { label: "地区", key: "state", format: (v: string) => v },
];

export default function Compare() {
  const [compareIds, setCompareIds] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("compare") || "[]");
    } catch {
      return [];
    }
  });
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");

  const favorites: number[] = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch {
      return [];
    }
  }, []);

  const compareSchools = schools.filter((s) => compareIds.includes(s.id));

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.trim().toLowerCase();
    return schools
      .filter((s) => !compareIds.includes(s.id))
      .filter(
        (s) =>
          s.nameCn.includes(q) ||
          s.name.toLowerCase().includes(q) ||
          s.state.includes(q)
      )
      .slice(0, 8);
  }, [search, compareIds]);

  const favoriteSchools = useMemo(() => {
    return schools
      .filter((s) => favorites.includes(s.id) && !compareIds.includes(s.id))
      .slice(0, 8);
  }, [favorites, compareIds]);

  const addSchool = (id: number) => {
    if (compareIds.length >= 3) return;
    if (compareIds.includes(id)) return;
    const next = [...compareIds, id];
    setCompareIds(next);
    localStorage.setItem("compare", JSON.stringify(next));
    setSearch("");
  };

  const removeSchool = (id: number) => {
    const next = compareIds.filter((i) => i !== id);
    setCompareIds(next);
    localStorage.setItem("compare", JSON.stringify(next));
  };

  const clearAll = () => {
    setCompareIds([]);
    localStorage.setItem("compare", JSON.stringify([]));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">学校对比</h1>
      <p className="text-gray-500 mb-8">
        选择 2-3 所学校，直观对比各项指标
      </p>

      {/* 已选学校 */}
      <div className="flex flex-wrap gap-3 mb-6">
        {compareSchools.map((school) => (
          <div
            key={school.id}
            className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-xl"
          >
            <span className="font-medium text-sm">{school.nameCn}</span>
            <button
              onClick={() => removeSchool(school.id)}
              className="text-purple-400 hover:text-purple-600 ml-1"
            >
              ×
            </button>
          </div>
        ))}
        {compareIds.length < 3 && (
          <div className="border-2 border-dashed border-gray-300 text-gray-400 px-4 py-2 rounded-xl text-sm">
            还可添加 {3 - compareIds.length} 所
          </div>
        )}
        {compareIds.length > 0 && (
          <button
            onClick={clearAll}
            className="text-gray-400 hover:text-red-500 text-sm px-3"
          >
            清空
          </button>
        )}
      </div>

      {/* 添加学校区域 */}
      {compareIds.length < 3 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          {/* 搜索框 */}
          <div className="relative mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 输入学校名称搜索..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm"
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-10 max-h-48 overflow-y-auto">
                {searchResults.map((school) => (
                  <button
                    key={school.id}
                    onClick={() => addSchool(school.id)}
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm flex items-center justify-between"
                  >
                    <div>
                      <span className="font-medium text-gray-900">
                        {school.nameCn}
                      </span>
                      <span className="text-gray-400 ml-2 text-xs">
                        {school.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {school.state}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 标签切换 */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                activeTab === "all"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              全部学校
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                activeTab === "favorites"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              ❤️ 从收藏中选择
              {favorites.length > 0 && (
                <span className="ml-1 text-xs">({favorites.length})</span>
              )}
            </button>
          </div>

          {/* 学校列表 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
            {(activeTab === "all" ? schools : favoriteSchools)
              .filter((s) => !compareIds.includes(s.id))
              .map((school) => (
                <button
                  key={school.id}
                  onClick={() => addSchool(school.id)}
                  className="text-left p-2.5 rounded-lg hover:bg-blue-50 border border-gray-100 text-sm transition-colors"
                >
                  <div className="font-medium text-gray-900 truncate">
                    {school.nameCn}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {school.state} · #{school.ranking}
                  </div>
                </button>
              ))}
          </div>

          {activeTab === "favorites" && favoriteSchools.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">
              还没有收藏任何学校，去学校库或智能选校页面收藏后再来对比
            </p>
          )}
        </div>
      )}

      {/* 对比表格 */}
      {compareSchools.length < 2 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">⚖️</p>
          <p className="text-lg">请至少选择 2 所学校进行对比</p>
          <p className="text-sm mt-2">
            通过搜索、浏览列表或从收藏中选择学校
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left p-4 text-sm font-medium text-gray-500 w-32">
                  对比项
                </th>
                {compareSchools.map((school) => (
                  <th
                    key={school.id}
                    className="text-center p-4 border-l border-gray-100"
                  >
                    <div className="font-semibold text-gray-900">
                      {school.nameCn}
                    </div>
                    <div className="text-xs text-gray-400">{school.name}</div>
                    <button
                      onClick={() => removeSchool(school.id)}
                      className="text-xs text-red-400 hover:text-red-600 mt-1"
                    >
                      移除
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compareFields.map((field) => (
                <tr key={field.key} className="border-b border-gray-50">
                  <td className="p-4 text-sm text-gray-500">{field.label}</td>
                  {compareSchools.map((school) => {
                    const value = school[field.key as keyof School];
                    const display = field.format(value as never);
                    let isBest = false;
                    if (
                      field.key === "ranking" ||
                      field.key === "acceptanceRate"
                    ) {
                      const values = compareSchools.map(
                        (s) => s[field.key as keyof School] as number
                      );
                      isBest =
                        field.key === "ranking"
                          ? value === Math.min(...values)
                          : value === Math.max(...values);
                    }
                    return (
                      <td
                        key={school.id}
                        className={`text-center p-4 text-sm border-l border-gray-100 ${
                          isBest
                            ? "font-semibold text-green-600"
                            : "text-gray-900"
                        }`}
                      >
                        {display}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr className="border-b border-gray-50">
                <td className="p-4 text-sm text-gray-500">特色标签</td>
                {compareSchools.map((school) => (
                  <td
                    key={school.id}
                    className="text-center p-4 border-l border-gray-100"
                  >
                    <div className="flex flex-wrap gap-1 justify-center">
                      {school.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-sm text-gray-500">特色亮点</td>
                {compareSchools.map((school) => (
                  <td
                    key={school.id}
                    className="text-center p-4 border-l border-gray-100"
                  >
                    <div className="flex flex-wrap gap-1 justify-center">
                      {school.highlights.slice(0, 3).map((h) => (
                        <span
                          key={h}
                          className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
