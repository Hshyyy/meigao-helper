import { Link } from "react-router-dom";
import { schools } from "../data/schools";

export default function Home() {
  const stats = {
    total: schools.length,
    topTier: schools.filter((s) => s.rankingTier === "顶尖").length,
    avgTuition: Math.round(
      schools.reduce((sum, s) => sum + s.tuition, 0) / schools.length
    ),
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            找到最适合你的美国寄宿高中
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            输入你的成绩和偏好，智能匹配推荐学校，让选校不再迷茫
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/recommend"
              className="bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-colors no-underline shadow-lg"
            >
              🎯 智能选校推荐
            </Link>
            <Link
              to="/schools"
              className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors no-underline"
            >
              📋 浏览全部学校
            </Link>
          </div>
          <div className="flex gap-4 justify-center flex-wrap mt-4">
            <Link
              to="/compare"
              className="border-2 border-white/60 text-white/80 px-6 py-2.5 rounded-xl font-medium text-base hover:bg-white/10 transition-colors no-underline"
            >
              ⚖️ 学校对比
            </Link>
            <Link
              to="/favorites"
              className="border-2 border-white/60 text-white/80 px-6 py-2.5 rounded-xl font-medium text-base hover:bg-white/10 transition-colors no-underline"
            >
              ❤️ 我的收藏
            </Link>
            <Link
              to="/timeline"
              className="border-2 border-white/60 text-white/80 px-6 py-2.5 rounded-xl font-medium text-base hover:bg-white/10 transition-colors no-underline"
            >
              📅 申请时间线
            </Link>
            <Link
              to="/cost"
              className="border-2 border-white/60 text-white/80 px-6 py-2.5 rounded-xl font-medium text-base hover:bg-white/10 transition-colors no-underline"
            >
              💰 费用计算
            </Link>
          </div>
        </div>
      </section>

      {/* 数据概览 */}
      <section className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {stats.total}
            </div>
            <div className="text-gray-500 mt-1">所热门寄宿美高</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600">
              {stats.topTier}
            </div>
            <div className="text-gray-500 mt-1">所顶尖名校</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">
              ${stats.avgTuition.toLocaleString()}
            </div>
            <div className="text-gray-500 mt-1">平均年学费</div>
          </div>
        </div>
      </section>

      {/* 功能介绍 */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
          如何使用
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📝</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">第一步：输入信息</h3>
            <p className="text-gray-600 text-sm">
              填写你的托福、SSAT、GPA 等成绩，以及地区偏好和预算
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🤖</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">第二步：智能匹配</h3>
            <p className="text-gray-600 text-sm">
              系统根据你的条件自动分析，筛选出最适合的学校
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎯</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">第三步：查看推荐</h3>
            <p className="text-gray-600 text-sm">
              获取冲刺校、匹配校、保底校的分层推荐方案
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-10 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">准备好了吗？</h2>
          <p className="text-blue-100 mb-6">
            现在就开始，找到属于你的理想美高
          </p>
          <Link
            to="/recommend"
            className="inline-block bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors no-underline"
          >
            开始智能选校 →
          </Link>
        </div>
      </section>
    </div>
  );
}
