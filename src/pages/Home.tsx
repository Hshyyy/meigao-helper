import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { schools, getEstimatedAnnualCost } from "../data/schools";
import type { School } from "../data/schools";
import ShareButton from "../components/ShareButton";
import MusicPlayer from "../components/MusicPlayer";
import SchoolDetail from "../components/SchoolDetail";

export default function Home() {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const stats = {
    total: schools.length,
    topTier: schools.filter((s) => s.rankingTier === "顶尖").length,
    avgTuition: Math.round(
      schools.reduce((sum, s) => sum + getEstimatedAnnualCost(s), 0) / schools.length
    ),
  };

  return (
    <div>
      <Helmet>
        <title>美高选校助手 — 智能匹配美国寄宿高中</title>
        <meta name="description" content="基于成绩、兴趣、预算等多维度智能匹配，帮助中国学生找到最适合的美国寄宿高中。" />
      </Helmet>

      {/* Hero */}
      <section className="relative text-white">
        {/* 背景图片 */}
        <div className="absolute inset-0 bg-cover" style={{ backgroundImage: "url('/hero-bg-3.jpg')", backgroundPosition: "center 60%" }} />
        {/* 半透明遮罩 */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10">
        <div className="absolute top-4 right-4 z-20">
          <ShareButton url={window.location.origin} label="分享网站" />
        </div>
        <div className="max-w-6xl mx-auto px-4 py-32 text-center">
          <p className="text-5xl md:text-6xl text-yellow-400 mb-12 font-bold tracking-widest">H-shy出品</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-8">
            为Hshy们推荐适合你的美国寄宿高中
          </h1>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            输入你的成绩和偏好，Chris为你智能匹配推荐学校，助力你成功圆梦！
          </p>
          <div className="flex gap-4 justify-center flex-wrap mb-10">
            <Link
              to="/recommend"
              className="bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-colors no-underline shadow-lg"
            >
              🎯 智能选校推荐
            </Link>
            <Link
              to="/schools"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors no-underline"
            >
              📋 浏览全部学校
            </Link>
          </div>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/compare"
              className="border-2 border-white/60 text-white/80 px-6 py-3 rounded-xl font-medium text-lg hover:bg-white/10 transition-colors no-underline"
            >
              ⚖️ 学校对比
            </Link>
            <Link
              to="/favorites"
              className="border-2 border-white/60 text-white/80 px-6 py-3 rounded-xl font-medium text-lg hover:bg-white/10 transition-colors no-underline"
            >
              ❤️ 我的收藏
            </Link>
            <Link
              to="/timeline"
              className="border-2 border-white/60 text-white/80 px-6 py-3 rounded-xl font-medium text-lg hover:bg-white/10 transition-colors no-underline"
            >
              📅 申请时间线
            </Link>
            <Link
              to="/cost"
              className="border-2 border-white/60 text-white/80 px-6 py-3 rounded-xl font-medium text-lg hover:bg-white/10 transition-colors no-underline"
            >
              💰 费用计算
            </Link>
            <Link
              to="/map"
              className="border-2 border-white/60 text-white/80 px-6 py-3 rounded-xl font-medium text-lg hover:bg-white/10 transition-colors no-underline"
            >
              🗺️ 学校地图
            </Link>
          </div>
        </div>
        </div>
      </section>

      {/* 数据概览 */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg border border-blue-200 p-8 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {stats.total}
            </div>
            <div className="text-gray-600 font-medium">所热门寄宿美高</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg border border-green-200 p-8 text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {stats.topTier}
            </div>
            <div className="text-gray-600 font-medium">所顶尖名校</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg border border-purple-200 p-8 text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              ${stats.avgTuition.toLocaleString()}
            </div>
            <div className="text-gray-600 font-medium">平均年学费</div>
          </div>
        </div>
      </section>

      {/* 精选顶尖名校 */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">🌟 精选顶尖名校</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {schools.filter(s => s.rankingTier === "顶尖").slice(0, 4).map((school) => (
            <div key={school.id} onClick={() => setSelectedSchool(school)} className="cursor-pointer group">
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all">
                {school.photoUrl ? (
                  <img src={school.photoUrl} alt={school.nameCn} className="w-full h-32 object-cover" />
                ) : (
                  <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-4xl">🏫</div>
                )}
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{school.nameCn}</h3>
                  <p className="text-xs text-gray-500 truncate">{school.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">#{school.ranking}</span>
                    <span className="text-xs text-blue-600 font-medium">${school.tuition.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link to="/schools" className="text-blue-600 hover:text-blue-700 font-medium text-sm no-underline">
            查看全部学校 →
          </Link>
        </div>
      </section>

      {/* 功能介绍 */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            How to use?
          </h2>
          <div className="flex items-center justify-center gap-2 text-gray-800">
            <span>look</span>
            <span className="text-2xl">👇</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📝</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-lg">Step 1: Enter information</h3>
            <p className="text-gray-600 text-sm">
              填写你的托福、SSAT、GPA 等成绩，以及地区偏好和预算
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🤖</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-lg">Step 2: Chris intelligently matches for u</h3>
            <p className="text-gray-600 text-sm">
              系统根据你的条件自动分析，筛选出最适合的学校
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎯</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-lg">Step 3: Review recommendations and suggestions</h3>
            <p className="text-gray-600 text-sm">
              获取冲刺校、匹配校、保底校的分层推荐方案
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="relative rounded-2xl overflow-hidden p-10 text-center text-white">
          {/* 背景图片 */}
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/hero-bg.jpg')" }} />
          {/* 半透明遮罩 */}
          <div className="absolute inset-0 bg-black/50" />
          {/* 内容 */}
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4">Are you ready?</h2>
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
        </div>
      </section>

      {/* 音乐播放器（固定在左下角） */}
      <div className="fixed bottom-4 left-4 z-50">
        <MusicPlayer />
      </div>

      {/* 学校详情弹窗 */}
      {selectedSchool && (
        <SchoolDetail school={selectedSchool} onClose={() => setSelectedSchool(null)} />
      )}
    </div>
  );
}
