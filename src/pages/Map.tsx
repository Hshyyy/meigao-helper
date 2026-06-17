import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { Helmet } from "react-helmet-async";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { schools } from "../data/schools";
import type { School } from "../data/schools";
import SchoolDetail from "../components/SchoolDetail";
import ShareButton from "../components/ShareButton";
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

const createSchoolIcon = (tier: string, nameCn: string, nameEn: string) => {
  const colors: Record<string, string> = { "顶尖": "#ef4444", "优秀": "#3b82f6", "热门": "#22c55e" };
  const color = colors[tier] || "#6b7280";
  // 截断英文名，避免太长
  const shortName = nameEn.length > 20 ? nameEn.substring(0, 18) + "..." : nameEn;
  return L.divIcon({
    className: "school-marker",
    html: `<div style="display:flex;flex-direction:column;align-items:center;transform:translateY(-10px);">
      <div style="background:${color};width:22px;height:22px;border-radius:50%;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:11px;color:white;font-weight:bold;">🎓</div>
      <div style="background:white;padding:2px 6px;border-radius:4px;margin-top:2px;box-shadow:0 1px 3px rgba(0,0,0,0.15);text-align:center;max-width:120px;">
        <div style="font-size:11px;font-weight:600;color:#333;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${nameCn}</div>
        <div style="font-size:9px;color:#888;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${shortName}</div>
      </div>
    </div>`,
    iconSize: [120, 48],
    iconAnchor: [11, 48],
    popupAnchor: [0, -48],
  });
};

// 控制地图交互的组件
function MapController({ onReady }: { onReady: () => void }) {
  const map = useMap();

  useEffect(() => {
    // 禁用所有交互
    map.dragging.disable();
    map.scrollWheelZoom.disable();
    map.doubleClickZoom.disable();
    map.touchZoom.disable();
    map.keyboard.disable();

    // 监听瓦片加载完成
    const handleLoad = () => {
      map.dragging.enable();
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
      map.touchZoom.enable();
      map.keyboard.enable();
      onReady();
    };

    map.on("load", handleLoad);

    // 如果地图已经加载完成
    if (map.getSize()) {
      setTimeout(handleLoad, 2000);
    }

    return () => {
      map.off("load", handleLoad);
    };
  }, [map, onReady]);

  return null;
}

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
    <div className="leaflet-top leaflet-right" style={{ top: 10, right: 10, zIndex: 1000 }}>
      <div className="leaflet-control flex flex-col gap-1">
        <button onClick={handleZoomIn} className="bg-white w-9 h-9 rounded-lg shadow-md flex items-center justify-center text-lg hover:bg-gray-50 border border-gray-200" title="放大">+</button>
        <button onClick={handleZoomOut} className="bg-white w-9 h-9 rounded-lg shadow-md flex items-center justify-center text-lg hover:bg-gray-50 border border-gray-200" title="缩小">−</button>
        <button onClick={handleReset} className="bg-white w-9 h-9 rounded-lg shadow-md flex items-center justify-center text-lg hover:bg-gray-50 border border-gray-200" title="重置视图">🏠</button>
        <button onClick={handleLocate} className="bg-white w-9 h-9 rounded-lg shadow-md flex items-center justify-center text-lg hover:bg-gray-50 border border-gray-200" title="定位我的位置">📍</button>
        <button onClick={onRefresh} className="bg-white w-9 h-9 rounded-lg shadow-md flex items-center justify-center text-lg hover:bg-gray-50 border border-gray-200" title="刷新地图">🔄</button>
      </div>
    </div>
  );
}

const SchoolMarker = ({ school, onSelect }: { school: School; onSelect: (school: School) => void }) => (
  <Marker position={[school.lat, school.lng]} icon={createSchoolIcon(school.rankingTier, school.nameCn, school.name)}>
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

  const filteredSchools = filterTier === "全部" ? schools : schools.filter((s) => s.rankingTier === filterTier);

  const handleReady = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <>
    <Helmet>
      <title>学校地图 — 美高选校助手</title>
      <meta name="description" content="在地图上查看美国寄宿高中的地理位置分布。" />
    </Helmet>

    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-gray-900">学校地图</h1>
        <ShareButton url={window.location.origin + "/map"} label="Share Map" />
      </div>
      <p className="text-gray-500 mb-6">
        在地图上查看 {schools.length} 所学校的地理位置，点击标记查看详情
      </p>

      {/* 筛选栏 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { key: "全部", label: "All", count: schools.length },
          { key: "顶尖", label: "🔴 Top", count: schools.filter((s) => s.rankingTier === "顶尖").length },
          { key: "优秀", label: "🔵 Excellent", count: schools.filter((s) => s.rankingTier === "优秀").length },
          { key: "热门", label: "🟢 Popular", count: schools.filter((s) => s.rankingTier === "热门").length },
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

      {/* 地图容器 */}
      <div
        id="map-container"
        className="relative bg-white rounded-xl shadow-sm border border-gray-200"
        style={{ overscrollBehavior: 'contain' }}
      >
        {/* 加载遮罩 - 放在地图外面 */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50/90 rounded-xl" style={{ zIndex: 9999 }}>
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-sm text-gray-500">地图加载中...</p>
              <p className="text-xs text-gray-400 mt-1">加载完成前无法缩放</p>
            </div>
          </div>
        )}

        {/* 地图 */}
        <div
          className="relative"
          style={{ height: "50vh", minHeight: "350px", maxHeight: "500px" }}
        >
          <MapContainer
            center={INITIAL_CENTER}
            zoom={INITIAL_ZOOM}
            maxZoom={18}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={false}
            touchZoom={true}
          >
          <MapController onReady={handleReady} />
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            subdomains={["a", "b", "c", "d"]}
          />
          <MapControls onRefresh={() => {}} />
          {filteredSchools.map((school) => (
            <SchoolMarker key={school.id} school={school} onSelect={setSelectedSchool} />
          ))}
        </MapContainer>
        </div>
      </div>

      {/* 图例 */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow" /><span>Top</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow" /><span>Excellent</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow" /><span>Popular</span></div>
        </div>
        <div className="text-xs text-gray-400 space-x-4">
          <span>📍 定位</span>
          <span>🏠 重置视图</span>
          <span>🔄 刷新瓦片</span>
        </div>
      </div>
    </div>

    {/* 详情弹窗用 Portal 渲染到 body，确保在地图之上 */}
    {selectedSchool && createPortal(
      <SchoolDetail school={selectedSchool} onClose={() => setSelectedSchool(null)} />,
      document.body
    )}
    </>
  );
}
