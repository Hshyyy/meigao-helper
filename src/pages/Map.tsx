import { useState, useCallback, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { schools } from "../data/schools";
import type { School } from "../data/schools";
import SchoolDetail from "../components/SchoolDetail";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

const INITIAL_CENTER: [number, number] = [
  schools.reduce((sum, s) => sum + s.lat, 0) / schools.length,
  schools.reduce((sum, s) => sum + s.lng, 0) / schools.length,
];
const INITIAL_ZOOM = 7;

const createSchoolIcon = (tier: string) => {
  const colors: Record<string, string> = { "顶尖": "#ef4444", "优秀": "#3b82f6", "热门": "#22c55e" };
  const color = colors[tier] || "#6b7280";
  return L.divIcon({
    className: "school-marker",
    html: `<div style="background:${color};width:22px;height:22px;border-radius:50%;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:11px;color:white;font-weight:bold;">🎓</div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -11],
  });
};

// 控制按钮组件
function MapControls({ onRefresh }: { onRefresh: () => void }) {
  const map = useMap();

  const handleZoomIn = () => map.zoomIn();
  const handleZoomOut = () => map.zoomOut();
  const handleReset = () => map.setView(INITIAL_CENTER, INITIAL_ZOOM);
  const handleLocate = () => {
    map.locate({ setView: true, maxZoom: 12 });
    map.on("locationerror", () => alert("无法获取位置，请检查浏览器权限"));
  };

  return (
    <div className="leaflet-top leaflet-right" style={{ top: 10, right: 10 }}>
      <div className="leaflet-control flex flex-col gap-1">
        <button onClick={handleZoomIn} className="bg-white w-9 h-9 rounded-lg shadow-md flex items-center justify-center text-lg hover:bg-gray-50 border border-gray-200" title="放大">+</button>
        <button onClick={handleZoomOut} className="bg-white w-9 h-9 rounded-lg shadow-md flex items-center justify-center text-lg hover:bg-gray-50 border border-gray-200" title="缩小">−</button>
        <button onClick={handleReset} className="bg-white w-9 h-9 rounded-lg shadow-md flex items-center justify-center text-lg hover:bg-gray-50 border border-gray-200" title="重置视图">🏠</button>
        <button onClick={handleLocate} className="bg-white w-9 h-9 rounded-lg shadow-md flex items-center justify-center text-lg hover:bg-gray-50 border border-gray-200" title="定位我的位置">📍</button>
        <button onClick={onRefresh} className="bg-white w-9 h-9 rounded-lg shadow-md flex items-center justify-center text-lg hover:bg-gray-50 border border-gray-200" title="刷新地图（解决瓦片卡住）">🔄</button>
      </div>
    </div>
  );
}

const SchoolMarker = ({ school, onSelect }: { school: School; onSelect: (s: School) => void }) => (
  <Marker position={[school.lat, school.lng]} icon={createSchoolIcon(school.rankingTier)} eventHandlers={{ click: () => onSelect(school) }}>
    <Popup>
      <div className="text-center min-w-[180px]">
        <h3 className="font-bold text-gray-900 mb-1">{school.nameCn}</h3>
        <p className="text-xs text-gray-400 mb-2">{school.name}</p>
        <div className="space-y-1 text-sm text-gray-600">
          <div>📍 {school.state} {school.city}</div>
          <div>🏆 #{school.ranking} · {school.rankingTier}</div>
          <div>💰 ${school.tuition.toLocaleString()}/年</div>
          <div>📊 录取率 {school.acceptanceRate}%</div>
        </div>
        <button onClick={() => onSelect(school)} className="mt-3 bg-blue-600 text-white text-xs px-4 py-1.5 rounded-lg hover:bg-blue-700">
          查看详情
        </button>
      </div>
    </Popup>
  </Marker>
);

export default function Map() {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [filterTier, setFilterTier] = useState("全部");
  const [loading, setLoading] = useState(true);
  const tileCountRef = useRef(0);
  const mapRef = useRef<any>(null);

  const filteredSchools = filterTier === "全部" ? schools : schools.filter((s) => s.rankingTier === filterTier);

  const handleTileLoad = useCallback(() => {
    tileCountRef.current += 1;
    if (tileCountRef.current >= 10) setLoading(false);
  }, []);

  const handleRefresh = useCallback(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      const center = map.getCenter();
      const zoom = map.getZoom();
      setLoading(true);
      tileCountRef.current = 0;
      // 强制重新加载瓦片
      map.eachLayer((layer: any) => {
        if (layer._url) layer.redraw();
      });
      setTimeout(() => {
        map.invalidateSize();
        map.setView(center, zoom);
        setLoading(false);
      }, 500);
    }
  }, []);

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
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterTier === key ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"}`}
          >
            {label}（{count}）
          </button>
        ))}
      </div>

      {/* 地图 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 z-10">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-sm text-gray-500">地图加载中...</p>
              <p className="text-xs text-gray-400 mt-1">首次加载可能需要几秒钟</p>
            </div>
          </div>
        )}
        <MapContainer
          ref={mapRef}
          center={INITIAL_CENTER}
          zoom={INITIAL_ZOOM}
          maxZoom={18}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            subdomains={["a", "b", "c", "d"]}
            eventHandlers={{ load: handleTileLoad }}
          />
          <MapControls onRefresh={handleRefresh} />
          {filteredSchools.map((school) => (
            <SchoolMarker key={school.id} school={school} onSelect={setSelectedSchool} />
          ))}
        </MapContainer>
      </div>

      {/* 图例和操作提示 */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow" /><span>顶尖</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow" /><span>优秀</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow" /><span>热门</span></div>
        </div>
        <div className="text-xs text-gray-400 space-x-4">
          <span>📍 定位</span>
          <span>🏠 重置视图</span>
          <span>🔄 刷新瓦片</span>
        </div>
      </div>

      {selectedSchool && <SchoolDetail school={selectedSchool} onClose={() => setSelectedSchool(null)} />}
    </div>
  );
}
