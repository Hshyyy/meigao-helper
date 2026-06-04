import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20 text-center">
      <p className="text-6xl mb-6">🏫</p>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        页面不存在
      </h1>
      <p className="text-gray-500 mb-8">
        你访问的页面似乎走丢了，回到首页重新开始吧
      </p>
      <Link
        to="/"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors no-underline"
      >
        🏠 返回首页
      </Link>
    </div>
  );
}
