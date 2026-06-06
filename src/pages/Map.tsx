import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { schools } from "../data/schools";
import type { School } from "../data/schools";
import SchoolDetail from "../components/SchoolDetail";
import "leaflet/dist/leaflet.css";

// Leaflet 默认图标修复
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
});

// 自定义学校标记图标
const createSchoolIcon = (tier: string) => {
  const colors: Record<string, string> = {
    "顶尖": "#ef4444",
    "优秀": "#3b82f6",
    "热门": "#22c55e",
  };
  const color = colors[tier] || "#6b7280";

  return L.divIcon({
    className: "school-marker",
    html: `<div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: white;
      font-weight: bold;
    ">🎓</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

// 定位按钮组件
function LocationButton() {
  const map = useMap();
  const [locating, setLocating] = useState(false);

  const handleLocate = () => {
    setLocating(true);
    map.locate({ setView: true, maxZoom: 12 });
    map.on("locationfound", () => setLocating(false));
    map.on("locationerror", () => {
      setLocating(false);
      alert("无法获取您的位置，请检查浏览器权限设置");
    });
  };

  return (
    <div className="leaflet-top leaflet-right" style={{ top: "10px", right: "10px" }}>
      <div className="leaflet-control">
        <button
          onClick={handleLocate}
          disabled={locating}
          className="bg-white w-10 h-10 rounded-lg shadow-md flex items-center justify-center text-lg hover:bg-gray-50 border border-gray-200"
          title="定位我的位置"
        >
          {locating ? "⏳" : "📍"}
        </button>
      </div>
    </div>
  );
}

export default function Map() {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [filterTier, setFilterTier] = useState("全部");

  const filteredSchools =
    filterTier === "全部"
      ? schools
      : schools.filter((s) => s.rankingTier === filterTier);

  // 计算地图中心点
  const center = {
    lat: schools.reduce((sum, s) => sum + s.lat, 0) / schools.length,
    lng: schools.reduce((sum, s) => sum + s.lng, 0) / schools.length,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">学校地图</h1>
      <p className="text-gray-500 mb-6">
        在地图上查看 {schools.length} 所学校的地理位置，点击标记查看详情
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

      {/* 地图 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={7}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationButton />
          {filteredSchools.map((school) => (
            <Marker
              key={school.id}
              position={[school.lat, school.lng]}
              icon={createSchoolIcon(school.rankingTier)}
              eventHandlers={{
                click: () => setSelectedSchool(school),
              }}
            >
              <Popup>
                <div className="text-center min-w-[200px]">
                  <h3 className="font-bold text-gray-900 mb-1">
                    {school.nameCn}
                  </h3>
                  <p className="text-xs text-gray-400 mb-2">{school.name}</p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>📍 {school.state} {school.city}</div>
                    <div>🏆 排名 #{school.ranking}</div>
                    <div>💰 学费 ${school.tuition.toLocaleString()}/年</div>
                    <div>📊 录取率 {school.acceptanceRate}%</div>
                  </div>
                  <button
                    onClick={() => setSelectedSchool(school)}
                    className="mt-3 bg-blue-600 text-white text-xs px-4 py-1.5 rounded-lg hover:bg-blue-700"
                  >
                    查看详情
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* 图例和说明 */}
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
          💡 点击标记查看学校信息，点击"查看详情"查看完整资料
        </p>
      </div>

      {/* 学校详情弹窗 */}
      {selectedSchool && (
        <SchoolDetail
          school={selectedSchool}
          onClose={() => setSelectedSchool(null)}
        />
      )}
    </div>
  );
}
