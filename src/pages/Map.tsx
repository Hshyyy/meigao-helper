import { useState } from "react";
import { schools } from "../data/schools";
import type { School } from "../data/schools";
import SchoolDetail from "../components/SchoolDetail";

// 美国地图坐标转换（将经纬度转换为图片上的百分比位置）
function coordToPercent(lat: number, lng: number) {
  // 美国大陆范围：纬度 24-50，经度 -125 到 -67
  const x = ((lng - (-125)) / ((-67) - (-125))) * 100;
  const y = ((50 - lat) / (50 - 24)) * 100;
  return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
}

const tierColors: Record<string, string> = {
  "顶尖": "bg-red-500",
  "优秀": "bg-blue-500",
  "热门": "bg-green-500",
};

export default function Map() {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [filterTier, setFilterTier] = useState("全部");
  const [hoveredSchool, setHoveredSchool] = useState<School | null>(null);

  const filteredSchools =
    filterTier === "全部"
      ? schools
      : schools.filter((s) => s.rankingTier === filterTier);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">学校地图</h1>
      <p className="text-gray-500 mb-6">
        查看 {schools.length} 所学校的地理位置分布
      </p>

      {/* 筛选栏 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { key: "全部", label: "全部学校", count: schools.length },
          { key: "顶尖", label: "🔴 顶尖", count: schools.filter((s) => s.rankingTier === "顶尖").length },
          { key: "优秀", label: "🔵 优秀", count: schools.filter((s) => s.rankingTier === "优秀").length },
          { key: "热门", label: "🟢 热门", count: schools.filter((s) => s.rankingTier === "热门").length },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilterTier(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterTier === key
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {label}（{count}）
          </button>
        ))}
      </div>

      {/* 地图区域 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="relative" style={{ paddingBottom: "60%", backgroundColor: "#e8f4f8" }}>
          {/* 美国地图背景 */}
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Map_of_USA_with_state_names.svg/1200px-Map_of_USA_with_state_names.svg.png"
            alt="美国地图"
            className="absolute inset-0 w-full h-full object-contain p-4"
            onError={(e) => {
              // 如果图片加载失败，显示纯色背景
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />

          {/* 学校标记 */}
          {filteredSchools.map((school) => {
            const pos = coordToPercent(school.lat, school.lng);
            const isHovered = hoveredSchool?.id === school.id;
            return (
              <div
                key={school.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                onClick={() => setSelectedSchool(school)}
                onMouseEnter={() => setHoveredSchool(school)}
                onMouseLeave={() => setHoveredSchool(null)}
              >
                {/* 标记点 */}
                <div
                  className={`w-5 h-5 rounded-full ${tierColors[school.rankingTier]} border-2 border-white shadow-md transition-transform ${
                    isHovered ? "scale-150" : "hover:scale-125"
                  }`}
                />

                {/* 悬停提示 */}
                {isHovered && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white rounded-lg shadow-lg p-3 min-w-[200px] z-10">
                    <p className="font-bold text-gray-900 text-sm">{school.nameCn}</p>
                    <p className="text-xs text-gray-400">{school.name}</p>
                    <div className="text-xs text-gray-600 mt-1 space-y-0.5">
                      <div>📍 {school.state}</div>
                      <div>💰 ${school.tuition.toLocaleString()}/年</div>
                      <div>📊 录取率 {school.acceptanceRate}%</div>
                    </div>
                    <p className="text-xs text-blue-600 mt-2">点击查看详情</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 图例 */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow" />
            <span>顶尖</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow" />
            <span>优秀</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow" />
            <span>热门</span>
          </div>
        </div>
        <p className="text-xs text-gray-400">
          💡 悬停查看学校信息，点击查看详情
        </p>
      </div>

      {/* 已选学校列表 */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-3">📍 学校列表</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {filteredSchools.map((school) => (
            <button
              key={school.id}
              onClick={() => setSelectedSchool(school)}
              className="text-left p-2 rounded-lg hover:bg-gray-50 border border-gray-100 text-sm transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${tierColors[school.rankingTier]}`} />
                <span className="font-medium text-gray-900 truncate">{school.nameCn}</span>
              </div>
              <div className="text-xs text-gray-400 ml-5">{school.state} · #{school.ranking}</div>
            </button>
          ))}
        </div>
      </div>

      {selectedSchool && <SchoolDetail school={selectedSchool} onClose={() => setSelectedSchool(null)} />}
    </div>
  );
}
