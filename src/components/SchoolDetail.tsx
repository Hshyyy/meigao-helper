import { useState } from "react";
import type { School } from "../data/schools";

interface StudentProfile {
  toefl: number;
  ssat: number;
  gpa: number;
  schoolType: string;
}

interface Props {
  school: School;
  onClose: () => void;
  profile?: StudentProfile;
}

// 住宿方案
const housingOptions = [
  { value: "boarding", label: "寄宿（住校）", cost: 0, note: "学费已含住宿和餐饮" },
  { value: "hostFamily", label: "寄宿家庭", cost: 15000, note: "住在美国家庭，含餐饮" },
  { value: "rent", label: "租房", cost: 12000, note: "自己租公寓，不含餐饮" },
  { value: "ownHouse", label: "My House", cost: 0, note: "家人在美国有房子" },
];

export default function SchoolDetail({ school, onClose, profile }: Props) {
  const isBoarding = school.type === "寄宿";
  const isDay = school.type === "走读";
  const isMixed = school.type === "寄宿/走读";

  // 根据学校类型设置默认住宿方式
  const [housing, setHousing] = useState(
    isDay ? "hostFamily" : "boarding"
  );

  const selectedHousing = housingOptions.find(h => h.value === housing) || housingOptions[0];
  const isEffectiveBoarding = isBoarding || (isMixed && housing === "boarding");
  const housingCost = isEffectiveBoarding ? 0 : selectedHousing.cost;
  const rentExtra = !isEffectiveBoarding && housing === "rent" ? 4800 : 0;
  const totalAnnual = school.tuition + housingCost + rentExtra + 5300;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{school.nameCn}</h2>
            <p className="text-sm text-gray-400">{school.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* 学校简介 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">📖 学校简介</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{school.description}</p>
          </div>

          {/* 基本信息 */}
          <div className="grid grid-cols-2 gap-3">
            <InfoItem label="Location" value={`${school.state} ${school.city}`} />
            <InfoItem label="Ranking" value={`#${school.ranking}`} />
            <InfoItem label="Boarding" value={school.type === "寄宿" ? "纯寄宿学校" : school.type === "寄宿/走读" ? "寄宿/走读可选" : "纯走读学校"} />
            <InfoItem label="Grades" value={school.grades} />
            <InfoItem label="Enrollment" value={`${school.studentCount} 人`} />
            <InfoItem label="Student-Faculty Ratio" value={school.studentTeacherRatio} />
            <InfoItem label="International Students" value={`${school.internationalRate}%`} />
            <InfoItem label="Acceptance Rate" value={`${school.acceptanceRate}%`} />
          </div>

          {/* 你的匹配分析 */}
          {profile && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">📊 你的匹配分析</h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <MatchItem
                  label="托福"
                  value={profile.toefl}
                  required={school.toeflMin}
                  unit="分"
                  higher
                />
                <MatchItem
                  label="SSAT"
                  value={profile.ssat}
                  required={school.ssatPercentile}
                  unit="%"
                  higher
                />
                <MatchItem
                  label="GPA"
                  value={profile.gpa}
                  required={school.gpaMin}
                  unit=""
                  higher
                />
              </div>
            </div>
          )}

          {/* 针对你的建议 */}
          {profile && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">💡 针对你的建议</h3>
              <ul className="space-y-2">
                {getPersonalizedAdvice(profile, school).map((tip, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 学校申请特点 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">📋 学校申请特点</h3>
            <ul className="space-y-2">
              {school.applicationTips.map((item) => (
                <li key={item} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* 录取要求 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">📊 Admission</h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Acceptance Rate</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${school.acceptanceRate}%` }} />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-10 text-right">{school.acceptanceRate}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">TOEFL</span>
                <span className="text-sm font-medium text-gray-900">{school.toeflMin}+</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">SSAT</span>
                <span className="text-sm font-medium text-gray-900">{school.ssatPercentile}%+</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">GPA</span>
                <span className="text-sm font-medium text-gray-900">{school.gpaMin}+</span>
              </div>
            </div>
          </div>

          {/* 住宿方式与费用 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">🏠 住宿方式与费用</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
              {/* 住宿选择 */}
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-2">选择住宿方式</label>
                {isBoarding ? (
                  <div className="text-sm text-blue-800 bg-blue-100 rounded-lg px-3 py-2">
                    ✅ 纯寄宿学校，所有学生必须住校
                  </div>
                ) : (
                  <div className="space-y-2">
                    {housingOptions.map((h) => {
                      const optionAvailable = !isDay || h.value !== "boarding";
                      return (
                        <label
                          key={h.value}
                          className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                            housing === h.value
                              ? "bg-blue-100 border border-blue-300"
                              : "hover:bg-blue-50 border border-transparent"
                          } ${!optionAvailable ? "opacity-40 cursor-not-allowed" : ""}`}
                        >
                          <input
                            type="radio"
                            name="housing"
                            value={h.value}
                            checked={housing === h.value}
                            onChange={(e) => setHousing(e.target.value)}
                            disabled={!optionAvailable}
                            className="text-blue-600"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {h.label}
                              {h.cost > 0 && <span className="text-gray-500 ml-2">+${h.cost.toLocaleString()}/年</span>}
                            </div>
                            <div className="text-xs text-gray-500">{h.note}</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 费用明细 */}
              <div className="border-t border-blue-200 pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-800">学费</span>
                  <span className="font-medium text-blue-900">${school.tuition.toLocaleString()}/年</span>
                </div>
                {!isEffectiveBoarding && housingCost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-800">{selectedHousing.label}</span>
                    <span className="font-medium text-blue-900">+${housingCost.toLocaleString()}/年</span>
                  </div>
                )}
                {!isEffectiveBoarding && housing === "rent" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-800">餐饮费</span>
                    <span className="font-medium text-blue-900">+$4,800/年</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-blue-800">其他费用（保险、书本等）</span>
                  <span className="font-medium text-blue-900">+$5,300/年</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t border-blue-200 pt-2">
                  <span className="text-blue-900">预估年总费用</span>
                  <span className="text-blue-900">${totalAnnual.toLocaleString()}/年</span>
                </div>
              </div>
            </div>
          </div>

          {/* 学术特色 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">📚 学术特色</h3>
            <ul className="space-y-2">
              {school.academicFeatures.map((item) => (
                <li key={item} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* 校园生活 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">🏫 校园生活</h3>
            <ul className="space-y-2">
              {school.campusLife.map((item) => (
                <li key={item} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* 升学走向 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">🎓 升学走向</h3>
            <ul className="space-y-2">
              {school.collegePrep.map((item) => (
                <li key={item} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* 学校标签 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">🏷️ 学校特色</h3>
            <div className="flex flex-wrap gap-2">
              {school.tags.map((tag) => (
                <span key={tag} className="bg-purple-50 text-purple-700 text-sm px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 官网链接 */}
          <a
            href={school.website}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors no-underline"
          >
            🌐 访问学校官网
          </a>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-medium text-gray-900 mt-0.5">{value}</div>
    </div>
  );
}

// 匹配度条
function MatchItem({
  label,
  value,
  required,
  unit,
  higher,
}: {
  label: string;
  value: number;
  required: number;
  unit: string;
  higher: boolean;
}) {
  const diff = value - required;
  const isGood = higher ? diff >= 0 : diff <= 0;
  const pct = Math.min(100, Math.max(0, (value / (required * 1.2)) * 100));

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-600">{label}</span>
        <span className={`text-sm font-medium ${isGood ? "text-green-600" : "text-red-600"}`}>
          {value}{unit} / 要求 {required}{unit}
          {diff > 0 ? ` (+${diff}${unit})` : diff < 0 ? ` (${diff}${unit})` : " ✓"}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${isGood ? "bg-green-500" : "bg-red-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// 生成个性化建议
function getPersonalizedAdvice(
  profile: { toefl: number; ssat: number; gpa: number; schoolType: string },
  school: School
): string[] {
  const tips: string[] = [];
  const toeflDiff = profile.toefl - school.toeflMin;
  const ssatDiff = profile.ssat - school.ssatPercentile;
  const gpaDiff = profile.gpa - school.gpaMin;

  // 托福建议
  if (toeflDiff >= 10) {
    tips.push(`托福 ${profile.toefl} 已超出要求 ${toeflDiff} 分，这是你的强项，申请时要重点展示`);
  } else if (toeflDiff >= 0) {
    tips.push(`托福 ${profile.toefl} 刚好达标，建议再提升 5-10 分以增加竞争力`);
  } else {
    tips.push(`托福 ${profile.toefl} 低于要求 ${Math.abs(toeflDiff)} 分，需要重点提升听力和口语`);
  }

  // SSAT 建议
  if (ssatDiff >= 5) {
    tips.push(`SSAT ${profile.ssat}% 超出要求，申请时可以强调你的标化优势`);
  } else if (ssatDiff >= 0) {
    tips.push(`SSAT ${profile.ssat}% 刚好达标，建议再冲刺 5% 以增加竞争力`);
  } else {
    tips.push(`SSAT ${profile.ssat}% 低于要求 ${Math.abs(ssatDiff)}%，需要重点突破词汇和阅读`);
  }

  // GPA 建议
  if (gpaDiff >= 0.3) {
    tips.push(`GPA ${profile.gpa} 超出要求，是你的优势，文书和面试中要重点提及`);
  } else if (gpaDiff >= 0) {
    tips.push(`GPA ${profile.gpa} 达标，保持稳定即可`);
  } else {
    tips.push(`GPA ${profile.gpa} 略低于要求，建议通过课外活动和文书来弥补`);
  }

  // 体系特定建议
  if (profile.schoolType === "ib") {
    tips.push("IB 课程被广泛认可，申请时强调你的跨学科学习经历和 CAS 活动");
    tips.push("部分学校接受 IB 成绩替代 SSAT，可优先考虑这些学校");
  } else if (profile.schoolType === "alevel") {
    tips.push("A-Level 课程深度足够，申请时突出你的学术专注度");
    tips.push("部分学校接受 GCSE 替代 SSAT，建议先确认目标学校要求");
  } else if (profile.schoolType === "ap") {
    tips.push("美式课程背景是优势，申请时强调你的 GPA 和课外活动");
    tips.push("AP 课程被广泛认可，保持 GPA 3.5+ 是关键");
  } else if (profile.schoolType === "public_intl") {
    tips.push("国际部学生通常有较好的英语基础，但面试仍需充分准备");
    tips.push("建议同时准备 SSAT 和 TOEFL，大部分学校要求这两项");
    tips.push("课外活动记录可能不如国际学校丰富，建议重点展示学术能力");
  } else if (profile.schoolType === "public") {
    tips.push("体制内学生英语是短板，建议提前 1-2 年开始系统准备");
    tips.push("面试是全英文的，建议找外教模拟练习，重点突破口语表达");
    tips.push("课外活动记录可能较少，建议通过文书展示个人特质和潜力");
    tips.push("推荐信可能不熟悉美式格式，建议与老师沟通格式要求");
  }

  return tips;
}
