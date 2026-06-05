import { useState } from "react";
import { Link } from "react-router-dom";
import { schools } from "../data/schools";
import type { School } from "../data/schools";
import SchoolCard from "../components/SchoolCard";
import SchoolDetail from "../components/SchoolDetail";

interface StudentProfile {
  toefl: number;
  ssat: number;
  gpa: number;
  region: string;
  maxBudget: number;
  schoolType: string;
}

type MatchResult = {
  school: School;
  type: "冲刺校" | "匹配校" | "保底校";
  score: number;
  reason: string;
};

function matchSchools(profile: StudentProfile): MatchResult[] {
  const results: MatchResult[] = [];

  for (const school of schools) {
    // 地区筛选
    if (profile.region !== "全部" && school.region !== profile.region) {
      continue;
    }

    // 预算筛选
    if (profile.maxBudget > 0 && school.tuition > profile.maxBudget) {
      continue;
    }

    // 计算匹配分数
    let score = 0;
    const reasons: string[] = [];

    // 托福匹配 (40%)
    const toeflDiff = profile.toefl - school.toeflMin;
    if (toeflDiff >= 10) {
      score += 40;
      reasons.push("托福远超要求");
    } else if (toeflDiff >= 0) {
      score += 30;
      reasons.push("托福达到要求");
    } else if (toeflDiff >= -5) {
      score += 15;
      reasons.push("托福略低于要求");
    } else {
      score += 5;
      reasons.push("托福低于要求较多");
    }

    // SSAT 匹配 (30%)
    const ssatDiff = profile.ssat - school.ssatPercentile;
    if (ssatDiff >= 5) {
      score += 30;
      reasons.push("SSAT 远超要求");
    } else if (ssatDiff >= 0) {
      score += 22;
      reasons.push("SSAT 达到要求");
    } else if (ssatDiff >= -5) {
      score += 10;
      reasons.push("SSAT 略低于要求");
    } else {
      score += 3;
      reasons.push("SSAT 低于要求较多");
    }

    // GPA 匹配 (20%)
    const gpaDiff = profile.gpa - school.gpaMin;
    if (gpaDiff >= 0.3) {
      score += 20;
      reasons.push("GPA 优秀");
    } else if (gpaDiff >= 0) {
      score += 15;
      reasons.push("GPA 达标");
    } else if (gpaDiff >= -0.2) {
      score += 8;
      reasons.push("GPA 略低");
    } else {
      score += 3;
      reasons.push("GPA 偏低");
    }

    // 录取率加成 (10%)
    if (school.acceptanceRate >= 30) {
      score += 10;
    } else if (school.acceptanceRate >= 20) {
      score += 7;
    } else {
      score += 3;
    }

    // 学校类型背景影响
    if (profile.schoolType === "ap") {
      score += 2;
      reasons.push("美式课程背景，适应性强");
    } else if (profile.schoolType === "ib") {
      score += 2;
      reasons.push("IB 背景，学术能力受认可");
    } else if (profile.schoolType === "alevel") {
      score += 1;
      reasons.push("A-Level 背景，需注意课程差异");
    } else if (profile.schoolType === "public_intl") {
      reasons.push("公立国际部背景，课程衔接良好");
    } else if (profile.schoolType === "public") {
      reasons.push("公立学校背景，需加强英语准备");
    }

    // 分类
    let type: "冲刺校" | "匹配校" | "保底校";
    if (score >= 75) {
      type = "保底校";
    } else if (score >= 50) {
      type = "匹配校";
    } else {
      type = "冲刺校";
    }

    results.push({
      school,
      type,
      score: Math.min(score, 100),
      reason: reasons.join("；"),
    });
  }

  // 按分数排序
  results.sort((a, b) => b.score - a.score);

  return results;
}

export default function Recommend() {
  const [profile, setProfile] = useState<StudentProfile>({
    toefl: 0,
    ssat: 0,
    gpa: 0,
    region: "全部",
    maxBudget: 0,
    schoolType: "",
  });
  const [results, setResults] = useState<MatchResult[] | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch {
      return [];
    }
  });

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const next = prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id];
      localStorage.setItem("favorites", JSON.stringify(next));
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const matched = matchSchools(profile);
    setResults(matched);
  };

  const update = (key: keyof StudentProfile, value: string | number) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const reachSchools = results?.filter((r) => r.type === "冲刺校") || [];
  const matchSchoolsList = results?.filter((r) => r.type === "匹配校") || [];
  const safeSchools = results?.filter((r) => r.type === "保底校") || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">智能选校推荐</h1>
      <p className="text-gray-500 mb-8">
        输入你的成绩和偏好，系统为你匹配最合适的学校
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧表单 */}
        <div className="lg:col-span-1">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-20"
          >
            <h2 className="font-semibold text-gray-900 mb-4">📋 你的信息</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  托福成绩（0-120）
                </label>
                <input
                  type="number"
                  min={0}
                  max={120}
                  value={profile.toefl || ""}
                  onChange={(e) => update("toefl", Number(e.target.value))}
                  placeholder="例如：100"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  💡 顶尖校建议 105+，优秀校建议 95+，热门校建议 85+
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SSAT 百分位（0-99）
                </label>
                <input
                  type="number"
                  min={0}
                  max={99}
                  value={profile.ssat || ""}
                  onChange={(e) => update("ssat", Number(e.target.value))}
                  placeholder="例如：85"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  💡 百分位指你超过了百分之多少的考生，顶尖校建议 90%+
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GPA（0-4.0）
                </label>
                <input
                  type="number"
                  min={0}
                  max={4}
                  step={0.1}
                  value={profile.gpa || ""}
                  onChange={(e) => update("gpa", Number(e.target.value))}
                  placeholder="例如：3.5"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  💡 4.0 为满分，顶尖校建议 3.7+，优秀校建议 3.5+
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  目前就读学校类型
                </label>
                <select
                  value={profile.schoolType}
                  onChange={(e) => update("schoolType", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">请选择</option>
                  <option value="ap">国际学校（美式/AP）</option>
                  <option value="ib">国际学校（IB）</option>
                  <option value="alevel">国际学校（A-Level/英式）</option>
                  <option value="public_intl">公立学校国际部</option>
                  <option value="public">公立学校普通班</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  偏好地区
                </label>
                <select
                  value={profile.region}
                  onChange={(e) => update("region", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option>全部</option>
                  <option>东北</option>
                  <option>西部</option>
                  <option>南部</option>
                  <option>中西部</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  预算上限（年学费，美元）
                </label>
                <select
                  value={profile.maxBudget}
                  onChange={(e) => update("maxBudget", Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value={0}>不限</option>
                  <option value={60000}>$60,000 以下</option>
                  <option value={63000}>$63,000 以下</option>
                  <option value={65000}>$65,000 以下</option>
                  <option value={70000}>$70,000 以下</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              🎯 开始匹配
            </button>
          </form>
        </div>

        {/* 右侧结果 */}
        <div className="lg:col-span-2">
          {results === null ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">🎯</p>
              <p className="text-lg">填写左侧信息后点击"开始匹配"</p>
              <p className="text-sm mt-2">
                系统将为你推荐冲刺校、匹配校和保底校
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">😅</p>
              <p className="text-lg">没有找到匹配的学校</p>
              <p className="text-sm mt-2">请尝试放宽筛选条件</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* 冲刺校 */}
              {reachSchools.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                      🔥 冲刺校
                    </span>
                    <span className="text-sm text-gray-500">
                      有一定挑战，值得尝试
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reachSchools.map((r) => (
                      <div key={r.school.id}>
                        <SchoolCard
                          school={r.school}
                          onClick={() => setSelectedSchool(r.school)}
                          matchScore={r.score}
                          matchColor="bg-red-500"
                          isFavorited={favorites.includes(r.school.id)}
                          onToggleFavorite={() => toggleFavorite(r.school.id)}

                        />
                        <p className="text-xs text-gray-500 mt-1 px-1">
                          {r.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* 匹配校 */}
              {matchSchoolsList.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      ✅ 匹配校
                    </span>
                    <span className="text-sm text-gray-500">
                      与你实力匹配，录取概率较大
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {matchSchoolsList.map((r) => (
                      <div key={r.school.id}>
                        <SchoolCard
                          school={r.school}
                          onClick={() => setSelectedSchool(r.school)}
                          matchScore={r.score}
                          matchColor="bg-blue-500"
                          isFavorited={favorites.includes(r.school.id)}
                          onToggleFavorite={() => toggleFavorite(r.school.id)}

                        />
                        <p className="text-xs text-gray-500 mt-1 px-1">
                          {r.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* 保底校 */}
              {safeSchools.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      🛡️ 保底校
                    </span>
                    <span className="text-sm text-gray-500">
                      录取把握很大，作为稳妥选择
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {safeSchools.map((r) => (
                      <div key={r.school.id}>
                        <SchoolCard
                          school={r.school}
                          onClick={() => setSelectedSchool(r.school)}
                          matchScore={r.score}
                          matchColor="bg-green-500"
                          isFavorited={favorites.includes(r.school.id)}
                          onToggleFavorite={() => toggleFavorite(r.school.id)}

                        />
                        <p className="text-xs text-gray-500 mt-1 px-1">
                          {r.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedSchool && (
        <SchoolDetail
          school={selectedSchool}
          onClose={() => setSelectedSchool(null)}
        />
      )}

      {/* 浮动对比入口按钮 */}
      <Link
        to="/compare"
        className="fixed bottom-6 right-6 bg-purple-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-purple-700 transition-colors no-underline z-30"
        title="学校对比"
      >
        ⚖️
      </Link>
    </div>
  );
}
