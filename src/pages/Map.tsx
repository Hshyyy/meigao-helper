import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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

export default function Map() {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [filterTier, setFilterTier] = useState("全部");

  const filteredSchools =
    filterTier === "全部"
      ? schools
      : schools.filter((s) => s.rankingTier === filterTier);

  // 计算地图中心点（所有学校的平均位置）
  const center = {
    lat: schools.reduce((sum, s) => sum + s.lat, 0) / schools.length,
    lng: schools.reduce((sum, s) => sum + s.lng, 0) / schools.length,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">学校地图</h1>
      <p className="text-gray-500 mb-6">
        在地图上查看 {schools.length} 所学校的地理位置
      </p>

      {/* 筛选栏 */}
      <div className="flex gap-2 mb-4">
        {["全部", "顶尖", "优秀", "热门"].map((tier) => (
          <button
            key={tier}
            onClick={() => setFilterTier(tier)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterTier === tier
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {tier === "全部" ? "全部学校" : `${tier}（${tier === "全部" ? schools.length : schools.filter((s) => s.rankingTier === tier).length}所）`}
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
          {filteredSchools.map((school) => (
            <Marker
              key={school.id}
              position={[school.lat, school.lng]}
              eventHandlers={{
                click: () => setSelectedSchool(school),
              }}
            >
              <Popup>
                <div className="text-center">
                  <strong>{school.nameCn}</strong>
                  <br />
                  <span className="text-sm text-gray-500">
                    {school.state} · #{school.ranking}
                  </span>
                  <br />
                  <span className="text-sm">
                    学费: ${school.tuition.toLocaleString()}/年
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* 图例 */}
      <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>顶尖</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>优秀</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>热门</span>
        </div>
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
