import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { MusicProvider } from "./contexts/MusicContext";
import MusicPlayer from "./components/MusicPlayer";

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

          {/* 桌面端导航 */}
          <div className="hidden md:flex gap-1">
            {navItems.map((item) => (
              location.pathname === "/" ? (
                <span
                  key={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium cursor-default ${
                    item.path === "/" ? "bg-blue-600 text-white" : "text-gray-400"
                  }`}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors no-underline ${
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

          {/* 手机端汉堡按钮 */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="菜单"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* 手机端下拉菜单 */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            {navItems.map((item) => (
              location.pathname === "/" ? (
                <span
                  key={item.path}
                  className={`block px-4 py-3 text-sm font-medium cursor-default ${
                    item.path === "/" ? "bg-blue-50 text-blue-600" : "text-gray-400"
                  }`}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-3 text-sm font-medium no-underline ${
                    location.pathname === item.path
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>
        )}
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

      {/* 音乐播放器（所有页面） */}
      <div className="fixed bottom-4 left-4 z-50">
        <MusicPlayer />
      </div>
    </div>
    </MusicProvider>
  );
}
