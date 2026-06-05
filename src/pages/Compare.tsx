import { useState } from "react";
import { schools } from "../data/schools";
import type { School } from "../data/schools";
import SchoolDetail from "../components/SchoolDetail";

// 住宿方案
const housingOptions = {
  boarding: { label: "寄宿（住校）", cost: 0, note: "含住宿餐饮" },
  hostFamily: { label: "寄宿家庭", cost: 15000, note: "含餐饮" },
  rent: { label: "租房", cost: 16800, note: "含餐饮费" },
  ownHouse: { label: "My House", cost: 0, note: "免费" },
};

type HousingChoice = "boarding" | "hostFamily" | "rent" | "ownHouse";

// 计算费用
function calcCost(school: School, choice: HousingChoice): number {
  const isBoarding = school.type === "寄宿" || (school.type === "寄宿/走读" && choice === "boarding");
  const housingCost = isBoarding ? 0 : housingOptions[choice].cost;
  return school.tuition + housingCost + 5300;
}

export default function Compare() {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [compareIds, setCompareIds] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("compare") || "[]");
    } catch {
      return [];
    }
  });
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");
  const [housingChoices, setHousingChoices] = useState<Record<number, HousingChoice>>({});

  const favorites: number[] = (() => {
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch {
      return [];
    }
  })();

  const compareSchools = schools.filter((s) => compareIds.includes(s.id));

  const source = activeTab === "all" ? schools : schools.filter((s) => favorites.includes(s.id));
  const filteredSchools = source
    .filter((s) => !compareIds.includes(s.id))
    .filter((s) => {
      if (!search.trim()) return true;
      const q = search.trim().toLowerCase();
      return (
        s.nameCn.includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.state.includes(q) ||
        s.city.toLowerCase().includes(q)
      );
    });

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

  // 获取学校的住宿选择
  const getHousingChoice = (school: School): HousingChoice => {
    if (housingChoices[school.id]) return housingChoices[school.id];
    if (school.type === "寄宿") return "boarding";
    if (school.type === "走读") return "hostFamily";
    return "boarding"; // 混合型默认寄宿
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
              placeholder="🔍 输入学校名称、地区搜索..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>

          {/* 标签切换 + 结果数量 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-2">
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
            <span className="text-xs text-gray-400">
              找到 {filteredSchools.length} 所学校
            </span>
          </div>

          {/* 学校列表 */}
          {filteredSchools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
              {filteredSchools.map((school) => (
                <button
                  key={school.id}
                  onClick={() => addSchool(school.id)}
                  className="text-left p-3 rounded-lg hover:bg-blue-50 border border-gray-100 text-sm transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900 truncate">
                      {school.nameCn}
                    </div>
                    <span className="text-xs text-gray-400 ml-2 shrink-0">
                      #{school.ranking}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span>{school.state}</span>
                    <span>${(school.tuition / 1000).toFixed(0)}k/年</span>
                    <span>录取 {school.acceptanceRate}%</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p className="text-2xl mb-2">🔍</p>
              <p className="text-sm">
                {search.trim()
                  ? `没有找到"${search}"相关的学校`
                  : activeTab === "favorites"
                  ? "还没有收藏任何学校，去学校库或智能选校页面收藏后再来对比"
                  : "没有可选的学校"}
              </p>
            </div>
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
                    <button
                      onClick={() => setSelectedSchool(school)}
                      className="font-semibold text-gray-900 hover:text-blue-600 hover:underline cursor-pointer bg-transparent border-none"
                    >
                      {school.nameCn}
                    </button>
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
              {/* Ranking */}
              <CompareRow label="Ranking" values={compareSchools.map(s => `#${s.ranking}`)} bestFn="min" bestValues={compareSchools.map(s => s.ranking)} />
              {/* Tier */}
              <CompareRow label="Tier" values={compareSchools.map(s => s.rankingTier)} />
              {/* Boarding */}
              <CompareRow label="Boarding" values={compareSchools.map(s => s.type === "寄宿" ? "纯寄宿学校" : s.type === "寄宿/走读" ? "寄宿/走读可选" : "纯走读学校")} />
              {/* Housing */}
              <tr className="border-b border-gray-50">
                <td className="p-4 text-sm text-gray-500">Housing</td>
                {compareSchools.map((school) => {
                  const choice = getHousingChoice(school);
                  const isPureBoarding = school.type === "寄宿";
                  return (
                    <td key={school.id} className="text-center p-4 border-l border-gray-100">
                      {isPureBoarding ? (
                        <span className="text-sm text-gray-600">寄宿（住校）</span>
                      ) : (
                        <select
                          value={choice}
                          onChange={(e) => setHousingChoices(prev => ({ ...prev, [school.id]: e.target.value as HousingChoice }))}
                          className="border border-gray-300 rounded px-2 py-1 text-xs"
                        >
                          {school.type === "寄宿/走读" && <option value="boarding">寄宿（住校）</option>}
                          <option value="hostFamily">寄宿家庭</option>
                          <option value="rent">租房</option>
                          <option value="ownHouse">My House</option>
                        </select>
                      )}
                    </td>
                  );
                })}
              </tr>
              {/* Tuition */}
              <CompareRow label="Tuition" values={compareSchools.map(s => `$${s.tuition.toLocaleString()}`)} />
              {/* Est. Annual Cost */}
              <CompareRow
                label="Est. Annual Cost"
                values={compareSchools.map(s => `$${calcCost(s, getHousingChoice(s)).toLocaleString()}`)}
                highlight
                bestFn="min"
                bestValues={compareSchools.map(s => calcCost(s, getHousingChoice(s)))}
              />
              {/* Acceptance Rate */}
              <CompareRow label="Acceptance Rate" values={compareSchools.map(s => `${s.acceptanceRate}%`)} bestFn="max" bestValues={compareSchools.map(s => s.acceptanceRate)} />
              {/* International Students */}
              <CompareRow label="International Students" values={compareSchools.map(s => `${s.internationalRate}%`)} />
              {/* TOEFL */}
              <CompareRow label="TOEFL" values={compareSchools.map(s => `${s.toeflMin}+`)} />
              {/* SSAT */}
              <CompareRow label="SSAT" values={compareSchools.map(s => `${s.ssatPercentile}%+`)} />
              {/* GPA */}
              <CompareRow label="GPA" values={compareSchools.map(s => `${s.gpaMin}+`)} />
              {/* Enrollment */}
              <CompareRow label="Enrollment" values={compareSchools.map(s => `${s.studentCount} 人`)} />
              {/* Student-Faculty Ratio */}
              <CompareRow label="Student-Faculty Ratio" values={compareSchools.map(s => s.studentTeacherRatio)} />
              {/* Grades */}
              <CompareRow label="Grades" values={compareSchools.map(s => s.grades)} />
              {/* Location */}
              <CompareRow label="Location" values={compareSchools.map(s => s.state)} />
              <tr className="border-b border-gray-50">
                <td className="p-4 text-sm text-gray-500">Tags</td>
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
                <td className="p-4 text-sm text-gray-500">Highlights</td>
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
          <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
            💡 可为混合型学校选择不同住宿方式，费用会自动重新计算。点击学校名称查看详情。
          </div>
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

// 对比行组件
function CompareRow({
  label,
  values,
  highlight,
  bestFn,
  bestValues,
}: {
  label: string;
  values: string[];
  highlight?: boolean;
  bestFn?: "min" | "max";
  bestValues?: number[];
}) {
  return (
    <tr className="border-b border-gray-50">
      <td className="p-4 text-sm text-gray-500">{label}</td>
      {values.map((val, i) => {
        let isBest = false;
        if (bestFn && bestValues) {
          isBest = bestFn === "min"
            ? bestValues[i] === Math.min(...bestValues)
            : bestValues[i] === Math.max(...bestValues);
        }
        return (
          <td
            key={i}
            className={`text-center p-4 text-sm border-l border-gray-100 ${
              isBest ? "font-semibold text-green-600" : highlight ? "font-semibold text-gray-900" : "text-gray-900"
            }`}
          >
            {val}
          </td>
        );
      })}
    </tr>
  );
}
