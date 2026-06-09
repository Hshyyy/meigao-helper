import { useState } from "react";
import { Link } from "react-router-dom";
import { schools } from "../data/schools";
import type { School } from "../data/schools";
import SchoolCard from "../components/SchoolCard";
import SchoolDetail from "../components/SchoolDetail";

type MatchResult = {
  school: School;
  type: "冲刺校" | "匹配校" | "保底校";
  score: number;
  reason: string;
  hasInterestMatch: boolean;
  interestMatchCount: number;
  sizeMatch: boolean;
};

function SchoolSection({
  results, onSelect, onToggleFavorite, favorites, ssatNote, profile, interests,
}: {
  results: MatchResult[];
  onSelect: (school: School) => void;
  onToggleFavorite: (id: number) => void;
  favorites: number[];
  ssatNote?: boolean;
  profile?: { toefl: number; gpa: number; schoolSize?: string[] };
  interests?: string[];
}) {
  const colorMap = {
    "冲刺校": { bg: "bg-red-100 text-red-700", dot: "bg-red-500" },
    "匹配校": { bg: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
    "保底校": { bg: "bg-green-100 text-green-700", dot: "bg-green-500" },
  };
  const descMap = {
    "冲刺校": "有一定挑战，值得尝试",
    "匹配校": "与你实力匹配，录取概率较大",
    "保底校": "录取把握很大，作为稳妥选择",
  };
  const groups = ["冲刺校", "匹配校", "保底校"]
    .map((t) => ({ type: t as MatchResult["type"], items: results.filter((r) => r.type === t) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="space-y-6">
      {groups.map(({ type, items }) => (
        <div key={type}>
          <div className="flex items-center gap-2 mb-3">
            <span className={`${colorMap[type].bg} px-3 py-1 rounded-full text-sm font-medium`}>
              {type === "冲刺校" ? "🔥" : type === "匹配校" ? "✅" : "🛡️"} {type}
            </span>
            <span className="text-sm text-gray-500">{descMap[type]}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((r) => (
              <div key={r.school.id}>
                <SchoolCard
                  school={r.school}
                  onClick={() => onSelect(r.school)}
                  matchScore={r.score}
                  matchColor={colorMap[type].dot}
                  isFavorited={favorites.includes(r.school.id)}
                  onToggleFavorite={() => onToggleFavorite(r.school.id)}
                />
                <p className={`text-xs mt-1 px-1 ${ssatNote ? "text-amber-600" : "text-gray-500"}`}>
                  {interests && interests.length > 0 && (
                    r.hasInterestMatch
                      ? <span className="text-green-600 mr-1">🎯 兴趣匹配</span>
                      : <span className="text-red-400 mr-1">❌ 兴趣不匹配</span>
                  )}
                  {profile?.schoolSize && profile.schoolSize.length > 0 && (
                    r.sizeMatch
                      ? <span className="text-blue-600 mr-1">📏 规模匹配</span>
                      : <span className="text-red-400 mr-1">❌ 规模不匹配</span>
                  )}
                  {ssatNote && profile ? (
                    <>⚠️ 建议 SSAT {r.school.ssatPercentile}%+，你的托福{profile.toefl >= r.school.toeflMin ? "达标" : `差${r.school.toeflMin - profile.toefl}分`}，GPA{profile.gpa >= r.school.gpaMin ? "达标" : `差${(r.school.gpaMin - profile.gpa).toFixed(1)}`}</>
                  ) : r.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

interface StudentProfile {
  toefl: number;
  ssat: number;
  gpa: number;
  region: string;
  maxBudget: number;
  schoolType: string;
  interests: string[];
  schoolSize: string[];
}

function matchSchools(profile: StudentProfile): MatchResult[] {
  const results: MatchResult[] = [];
  const canSkipSSAT = (profile.schoolType === "ib" || profile.schoolType === "alevel") && profile.ssat === 0;

  for (const school of schools) {
    if (profile.region !== "全部" && school.region !== profile.region) continue;
    if (profile.maxBudget > 0 && school.tuition > profile.maxBudget) continue;

    let score = 0;
    const reasons: string[] = [];

    // 托福
    const toeflDiff = profile.toefl - school.toeflMin;
    if (toeflDiff >= 10) { score += 40; reasons.push(`托福 ${profile.toefl}，超出要求 ${toeflDiff} 分`); }
    else if (toeflDiff >= 0) { score += 30; reasons.push(`托福 ${profile.toefl}，刚好达标`); }
    else if (toeflDiff >= -5) { score += 15; reasons.push(`托福 ${profile.toefl}，低于要求 ${Math.abs(toeflDiff)} 分`); }
    else { score += 5; reasons.push(`托福 ${profile.toefl}，低于要求 ${Math.abs(toeflDiff)} 分`); }

    // SSAT
    if (canSkipSSAT) {
      if (!school.ssatRequired) { score += 25; reasons.push("可用课程成绩替代 SSAT"); }
      else { score += 10; reasons.push("该校要求 SSAT，建议补充成绩"); }
    } else {
      const ssatDiff = profile.ssat - school.ssatPercentile;
      if (ssatDiff >= 5) { score += 30; reasons.push(`SSAT ${profile.ssat}%，超出要求 ${ssatDiff}%`); }
      else if (ssatDiff >= 0) { score += 22; reasons.push(`SSAT ${profile.ssat}%，刚好达标`); }
      else if (ssatDiff >= -5) { score += 10; reasons.push(`SSAT ${profile.ssat}%，低于要求 ${Math.abs(ssatDiff)}%`); }
      else { score += 3; reasons.push(`SSAT ${profile.ssat}%，低于要求 ${Math.abs(ssatDiff)}%`); }
    }

    // GPA（体制内学生用百分比比较）
    const gpaToPercent = (gpa: number): number => {
      if (gpa >= 4.0) return 93;
      if (gpa >= 3.7) return 90;
      if (gpa >= 3.5) return 87;
      if (gpa >= 3.3) return 83;
      if (gpa >= 3.0) return 80;
      if (gpa >= 2.7) return 77;
      return 70;
    };

    let gpaDiff: number;
    let gpaLabel: string;
    if (profile.schoolType === "public") {
      const requiredPercent = gpaToPercent(school.gpaMin);
      gpaDiff = profile.gpa - requiredPercent;
      gpaLabel = `${profile.gpa}% / 要求约 ${requiredPercent}%`;
    } else {
      gpaDiff = profile.gpa - school.gpaMin;
      gpaLabel = `GPA ${profile.gpa} / 要求 ${school.gpaMin}`;
    }

    if (gpaDiff >= 5) { score += 20; reasons.push(`${gpaLabel}，超出要求`); }
    else if (gpaDiff >= 0) { score += 15; reasons.push(`${gpaLabel}，刚好达标`); }
    else if (gpaDiff >= -3) { score += 8; reasons.push(`${gpaLabel}，略低于要求`); }
    else { score += 3; reasons.push(`${gpaLabel}，低于要求较多`); }

    // 录取率
    if (school.acceptanceRate >= 30) score += 10;
    else if (school.acceptanceRate >= 20) score += 7;
    else score += 3;

    // 学校类型
    if (profile.schoolType === "ap") { score += 2; reasons.push("美式课程背景，适应性强"); }
    else if (profile.schoolType === "ib") { score += 2; reasons.push("IB 背景，学术能力受认可"); }
    else if (profile.schoolType === "alevel") { score += 1; reasons.push("A-Level 背景，需注意课程差异"); }
    else if (profile.schoolType === "public_intl") { reasons.push("公立国际部背景，课程衔接良好"); }
    else if (profile.schoolType === "public") { reasons.push("公立学校背景，需加强英语准备"); }

    // 兴趣匹配（不影响分数，只做标记和排序）
    const interestMatch = profile.interests.filter((i) => school.tags.some((tag) => tag.includes(i)));
    const hasInterestMatch = profile.interests.length > 0 && interestMatch.length > 0;
    const interestMatchCount = interestMatch.length;
    if (hasInterestMatch) {
      reasons.push(`${interestMatch.join("/")} 方向匹配`);
    }

    // 学校规模（不影响分数，只做标记）
    const sizeMatch = profile.schoolSize.length > 0
      ? (profile.schoolSize.includes("small") && school.studentCount < 400) ||
        (profile.schoolSize.includes("medium") && school.studentCount >= 400 && school.studentCount <= 700) ||
        (profile.schoolSize.includes("large") && school.studentCount > 700)
      : false;
    if (sizeMatch) {
      reasons.push("学校规模符合偏好");
    }

    let type: "冲刺校" | "匹配校" | "保底校";
    if (score >= 75) type = "保底校";
    else if (score >= 50) type = "匹配校";
    else type = "冲刺校";

    results.push({
      school,
      type,
      score: Math.min(score, 100),
      reason: reasons.join("；"),
      hasInterestMatch,
      interestMatchCount,
      sizeMatch,
    });
  }

  // 排序：成绩优先，成绩相同时兴趣匹配多的优先，兴趣相同时规模优先
  return results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.interestMatchCount !== b.interestMatchCount) return b.interestMatchCount - a.interestMatchCount;
    if (a.sizeMatch !== b.sizeMatch) return a.sizeMatch ? -1 : 1;
    return 0;
  });
}

export default function Recommend() {
  const [profile, setProfile] = useState<StudentProfile>({
    toefl: 0, ssat: 0, gpa: 0, region: "全部", maxBudget: 0, schoolType: "", interests: [], schoolSize: [],
  });
  const [results, setResults] = useState<MatchResult[] | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [favorites, setFavorites] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem("favorites") || "[]"); } catch { return []; }
  });
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      localStorage.setItem("favorites", JSON.stringify(next));
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.schoolType) { showToast("Chris提醒你：还没选学校类型呢～"); return; }
    setResults(matchSchools(profile));
  };

  const update = (key: keyof StudentProfile, value: string | number | string[]) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  // 输入验证：超出范围时弹出提示并恢复为最大值
  const handleNumberInput = (
    key: keyof StudentProfile,
    value: number,
    min: number,
    max: number,
    label: string
  ) => {
    if (value > max) {
      showToast(`Chris提醒你：${label}满分 ${max}，超过就牛逼过头咯～`);
      update(key, max);
    } else if (value < min && value !== 0) {
      showToast(`Chris提醒你：${label}不能低于 ${min} 哦～`);
      update(key, min);
    } else {
      update(key, value);
    }
  };

  const canSkipSSAT = (profile.schoolType === "ib" || profile.schoolType === "alevel") && profile.ssat === 0;
  const ssatFreeSchools = canSkipSSAT ? results?.filter((r) => !r.school.ssatRequired) || [] : [];
  const ssatRequiredSchools = canSkipSSAT
    ? results?.filter((r) => {
        if (!r.school.ssatRequired) return false;
        return profile.toefl >= r.school.toeflMin - 10 && profile.gpa >= r.school.gpaMin - 0.3;
      }) || []
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">智能选校推荐</h1>
      <p className="text-gray-500 mb-8">输入你的成绩和偏好，系统为你匹配最合适的学校</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-20">
            <h2 className="font-semibold text-gray-900 mb-4">📋 你的信息</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">托福成绩（0-120）</label>
                <input type="number" min={0} max={120} value={profile.toefl || ""} onChange={(e) => handleNumberInput("toefl", Number(e.target.value), 0, 120, "托福成绩")} placeholder="例如：100" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" required />
                <p className="text-xs text-gray-400 mt-1">💡 顶尖校建议 105+，优秀校建议 95+，热门校建议 85+</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SSAT 百分位（0-99）</label>
                <input type="number" min={0} max={99} value={profile.ssat || ""} onChange={(e) => handleNumberInput("ssat", Number(e.target.value), 0, 99, "SSAT 百分位")} placeholder={canSkipSSAT ? "不填则免 SSAT 学校优先" : "例如：85"} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" required={!canSkipSSAT} />
                <p className="text-xs text-gray-400 mt-1">
                  {profile.schoolType === "ib" ? "💡 部分学校接受 IB 成绩替代 SSAT" : profile.schoolType === "alevel" ? "💡 部分学校接受 GCSE 替代 SSAT" : "💡 百分位指你超过了百分之多少的考生，顶尖校建议 90%+"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">目前就读学校类型</label>
                <select value={profile.schoolType} onChange={(e) => update("schoolType", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900">
                  <option value="" disabled hidden>选择学校类型</option>
                  <option value="ap">国际学校（美式/AP）</option>
                  <option value="ib">国际学校（IB）</option>
                  <option value="alevel">国际学校（A-Level/英式）</option>
                  <option value="public_intl">体制内学校国际部</option>
                  <option value="public">体制内教育体系</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {profile.schoolType === "public" ? "成绩估算百分比（%）" : "GPA（0-4.0）"}
                </label>
                <input type="number" min={0} max={profile.schoolType === "public" ? 100 : 4} step={profile.schoolType === "public" ? 1 : 0.1} value={profile.gpa || ""} onChange={(e) => handleNumberInput("gpa", Number(e.target.value), 0, profile.schoolType === "public" ? 100 : 4, profile.schoolType === "public" ? "成绩百分比" : "GPA")} placeholder={profile.schoolType === "public" ? "例如：88" : "例如：3.5"} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" required />
                <p className="text-xs text-gray-400 mt-1">
                  {profile.schoolType === "public" ? "💡 按实际成绩填写，顶尖校建议 90%+，优秀校建议 85%+" : "💡 4.0 为满分，顶尖校建议 3.7+，优秀校建议 3.5+"}
                </p>
                {profile.schoolType === "public" && <p className="text-xs text-gray-400 mt-0.5">📌 实际申请时需提交所有科目的完整成绩单</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">偏好地区</label>
                <select value={profile.region} onChange={(e) => update("region", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option>全部</option><option>东北</option><option>西部</option><option>南部</option><option>中西部</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">预算上限（年学费）</label>
                <select value={profile.maxBudget} onChange={(e) => update("maxBudget", Number(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option value={0}>不限</option><option value={60000}>$60,000 以下</option><option value={63000}>$63,000 以下</option><option value={65000}>$65,000 以下</option><option value={70000}>$70,000 以下</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">🎯 兴趣方向（可多选）</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => update("interests", [])}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      profile.interests.length === 0 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    不限
                  </button>
                  {["STEM", "文科", "艺术", "体育", "公益"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        update(
                          "interests",
                          profile.interests.includes(item)
                            ? profile.interests.filter((i) => i !== item)
                            : [...profile.interests.filter((i) => i !== ""), item]
                        )
                      }
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        profile.interests.includes(item) ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1">💡 选择你最有深度的方向，匹配相关学校</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">📏 学校规模偏好（可多选）</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => update("schoolSize", [])}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      profile.schoolSize.length === 0 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    不限
                  </button>
                  {[
                    { value: "small", label: "小型（400人以下）" },
                    { value: "medium", label: "中型（400-700人）" },
                    { value: "large", label: "大型（700人以上）" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() =>
                        update(
                          "schoolSize",
                          profile.schoolSize.includes(item.value)
                            ? profile.schoolSize.filter((s) => s !== item.value)
                            : [...profile.schoolSize.filter((s) => s !== ""), item.value]
                        )
                      }
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        profile.schoolSize.includes(item.value) ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button type="submit" className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">🎯 开始匹配</button>
          </form>
        </div>

        <div className="lg:col-span-2">
          {results === null ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">🎯</p>
              <p className="text-lg">填写左侧信息后点击"开始匹配"</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">😅</p>
              <p className="text-lg">没有找到匹配的学校</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* IB/A-Level 未填 SSAT 时，按 SSAT 分组 */}
              {canSkipSSAT ? (
                <>
                  {ssatFreeSchools.length > 0 && (
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">✅ 免 SSAT 学校</span>
                        <span className="text-sm text-gray-500">可用 IB/A-Level 成绩替代</span>
                      </div>
                      <SchoolSection results={ssatFreeSchools} onSelect={setSelectedSchool} onToggleFavorite={toggleFavorite} favorites={favorites} interests={profile.interests} profile={profile} />
                    </section>
                  )}
                  {ssatRequiredSchools.length > 0 && (
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">📝 建议考 SSAT</span>
                        <span className="text-sm text-gray-500">以下学校要求 SSAT</span>
                      </div>
                      <SchoolSection results={ssatRequiredSchools} onSelect={setSelectedSchool} onToggleFavorite={toggleFavorite} favorites={favorites} ssatNote profile={profile} interests={profile.interests} />
                    </section>
                  )}
                </>
              ) : (
                <SchoolSection results={results} onSelect={setSelectedSchool} onToggleFavorite={toggleFavorite} favorites={favorites} interests={profile.interests} profile={profile} />
              )}
            </div>
          )}
        </div>
      </div>

      {selectedSchool && <SchoolDetail school={selectedSchool} onClose={() => setSelectedSchool(null)} profile={profile} />}
      <Link to="/compare" className="fixed bottom-6 right-6 bg-purple-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-purple-700 transition-colors no-underline z-30" title="学校对比">⚖️</Link>

      {/* Toast 提示 */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-5 py-3 rounded-lg shadow-lg z-50 text-sm max-w-md animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
