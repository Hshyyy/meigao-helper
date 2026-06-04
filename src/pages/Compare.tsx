import { useState } from "react";
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
  const [showSelector, setShowSelector] = useState(false);

  const compareSchools = schools.filter((s) => compareIds.includes(s.id));

  const addSchool = (id: number) => {
    if (compareIds.length >= 3) return;
    if (compareIds.includes(id)) return;
    const next = [...compareIds, id];
    setCompareIds(next);
    localStorage.setItem("compare", JSON.stringify(next));
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
            className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl"
          >
            <span className="font-medium text-sm">{school.nameCn}</span>
            <button
              onClick={() => removeSchool(school.id)}
              className="text-blue-400 hover:text-blue-600"
            >
              ×
            </button>
          </div>
        ))}
        {compareIds.length < 3 && (
          <button
            onClick={() => setShowSelector(!showSelector)}
            className="border-2 border-dashed border-gray-300 text-gray-500 px-4 py-2 rounded-xl hover:border-blue-400 hover:text-blue-500 text-sm"
          >
            + 添加学校
          </button>
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

      {/* 学校选择器 */}
      {showSelector && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 max-h-60 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {schools
              .filter((s) => !compareIds.includes(s.id))
              .map((school) => (
                <button
                  key={school.id}
                  onClick={() => addSchool(school.id)}
                  className="text-left p-2 rounded-lg hover:bg-blue-50 text-sm"
                >
                  <div className="font-medium text-gray-900 truncate">
                    {school.nameCn}
                  </div>
                  <div className="text-xs text-gray-400">{school.state}</div>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* 对比表格 */}
      {compareSchools.length < 2 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">⚖️</p>
          <p className="text-lg">请至少选择 2 所学校进行对比</p>
          <p className="text-sm mt-2">点击上方"+ 添加学校"选择要对比的学校</p>
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
                    // 高亮最优值
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
              {/* 标签行 */}
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
              {/* 亮点行 */}
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
