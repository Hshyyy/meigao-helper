import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { MusicProvider } from "./contexts/MusicContext";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/schools", label: "Schools" },
  { path: "/recommend", label: "Recommendation" },
  { path: "/favorites", label: "❤️ Favorites" },
  { path: "/compare", label: "⚖️ Compare" },
  { path: "/timeline", label: "📅 Timeline" },
  { path: "/cost", label: "💰 Cost" },
  { path: "/map", label: "🗺️ Map" },
];

export default function App() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <MusicProvider>
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 no-underline"
            onClick={() => setMenuOpen(false)}
          >
            <span className="text-2xl">🎓</span>
            <span className="text-xl font-bold text-gray-900">
              美高选校助手
            </span>
          </Link>

          {/* 导航栏 - 手机端和电脑端一样 */}
          <div className="flex gap-1 overflow-x-auto">
            {navItems.map((item) => (
              location.pathname === "/" ? (
                <span
                  key={item.path}
                  className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium cursor-default whitespace-nowrap ${
                    item.path === "/" ? "bg-blue-600 text-white" : "text-gray-400"
                  }`}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors no-underline whitespace-nowrap ${
                    location.pathname === item.path
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>
      </nav>

      {/* 页面内容 */}
      <main>
        <Outlet />
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>美高选校助手 — 帮助国际学校学生找到最适合的美国寄宿高中</p>
          <p className="mt-2">数据仅供参考，请以学校官网为准</p>
        </div>
      </footer>
    </div>
    </MusicProvider>
  );
}
