import { useState } from "react";
import type { School } from "../data/schools";

interface Props {
  school: School;
  onClose: () => void;
}

// 住宿方案
const housingOptions = [
  { value: "boarding", label: "寄宿（住校）", cost: 0, note: "学费已含住宿和餐饮" },
  { value: "hostFamily", label: "寄宿家庭", cost: 15000, note: "住在美国家庭，含餐饮" },
  { value: "rent", label: "租房", cost: 12000, note: "自己租公寓，不含餐饮" },
  { value: "ownHouse", label: "My House", cost: 0, note: "家人在美国有房子" },
];

export default function SchoolDetail({ school, onClose }: Props) {
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
            <InfoItem label="Acceptance" value={`${school.acceptanceRate}%`} />
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

          {/* 申请建议 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">💡 申请建议</h3>
            <ul className="space-y-2">
              {school.applicationTips.map((item) => (
                <li key={item} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
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
