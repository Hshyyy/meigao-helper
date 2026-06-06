import { useState, useMemo } from "react";
import { schools } from "../data/schools";

interface CostItem {
  name: string;
  amount: number;
  note: string;
}

// 住宿方案选项
const housingOptions = [
  { value: "hostFamily", label: "寄宿家庭", cost: 15000, note: "住在美国家庭，含餐饮" },
  { value: "rent", label: "租房", cost: 12000, note: "自己租公寓，不含餐饮" },
  { value: "guardian", label: "监护人寄宿", cost: 18000, note: "住监护人家，含餐饮和监管" },
  { value: "ownHouse", label: "My House", cost: 0, note: "家人在美国有房子" },
];

export default function CostCalculator() {
  const [selectedSchoolId, setSelectedSchoolId] = useState<number>(schools[0].id);
  const [studyYears, setStudyYears] = useState(4);
  const [tripsPerYear, setTripsPerYear] = useState(2);
  const [flightCost, setFlightCost] = useState("1500");
  const [applySchools, setApplySchools] = useState("10");
  const [dayHousingChoice, setDayHousingChoice] = useState("hostFamily");
  const [mixedChoice, setMixedChoice] = useState<"boarding" | "day">("boarding");

  const flightCostNum = Number(flightCost) || 0;
  const applySchoolsNum = Number(applySchools) || 0;

  const selectedSchool = useMemo(
    () => schools.find((s) => s.id === selectedSchoolId) || schools[0],
    [selectedSchoolId]
  );

  // 学校类型判断
  const schoolType = selectedSchool.type;
  const isPureBoarding = schoolType === "寄宿";
  const isPureDay = schoolType === "走读";
  const isMixed = schoolType === "寄宿/走读";

  // 最终是否寄宿
  const isBoarding = isPureBoarding || (isMixed && mixedChoice === "boarding");

  // 走读时的住宿方案
  const housingOption = housingOptions.find(h => h.value === dayHousingChoice) || housingOptions[0];

  // 住宿费用
  const estimatedRoomBoard = Math.round(selectedSchool.tuition * 0.22);
  const housingCost = isBoarding ? 0 : housingOption.cost;

  // 根据城市调整生活成本（精确到城市）
  const cityMultiplier: Record<string, number> = {
    "Andover": 1.38, "Deerfield": 1.25, "Concord": 1.35, "Groton": 1.28,
    "Milton": 1.40, "Southborough": 1.32, "Byfield": 1.25, "Marion": 1.22,
    "Wallingford": 1.28, "Lakeville": 1.25, "Watertown": 1.22, "Windsor": 1.20,
    "Kent": 1.22, "Farmington": 1.28, "Pomfret": 1.18, "Suffield": 1.20,
    "Exeter": 1.22, "Lawrenceville": 1.30, "Hightstown": 1.25, "Blairstown": 1.18,
    "Pottstown": 1.15, "Mercersburg": 1.08, "Ojai": 1.28, "Carpinteria": 1.30,
    "Claremont": 1.25, "Alexandria": 1.35, "Woodberry Forest": 1.05, "Middletown": 1.12,
  };
  const stateMultiplier: Record<string, number> = {
    "马萨诸塞州": 1.35, "康涅狄格州": 1.30, "新罕布什尔州": 1.20,
    "新泽西州": 1.25, "宾夕法尼亚州": 1.15, "加利福尼亚州": 1.30,
    "弗吉尼亚州": 1.10, "特拉华州": 1.10,
  };
  const mult = cityMultiplier[selectedSchool.city] || stateMultiplier[selectedSchool.state] || 1.1;
  const r = `（${selectedSchool.city}）`;

  // 年度费用明细
  const annualCosts: CostItem[] = useMemo(() => {
    const costs: CostItem[] = [];

    // 学费
    costs.push({
      name: "学费（Tuition）",
      amount: selectedSchool.tuition,
      note: isBoarding ? "含住宿和餐饮" : "不含住宿",
    });

    // 住宿费用（仅走读时）
    if (!isBoarding && housingCost > 0) {
      costs.push({
        name: `住宿：${housingOption.label}`,
        amount: Math.round(housingCost * mult),
        note: `${housingOption.note} ${r}`,
      });
    }

    // 走读且租房时，需要额外餐饮费
    if (!isBoarding && dayHousingChoice === "rent") {
      costs.push({
        name: "餐饮费",
        amount: Math.round(4800 * mult),
        note: `自己做饭 ${r}`,
      });
    }

    // 其他费用
    costs.push(
      { name: "医疗保险", amount: 1800, note: "国际学生必须购买" },
      { name: "书本和学习用品", amount: 800, note: "教科书、文具等" },
      { name: "个人开支", amount: Math.round(1500 * mult), note: `衣物、日用品、娱乐 ${r}` },
      { name: "往返机票", amount: flightCostNum * tripsPerYear, note: `${tripsPerYear} 次/年 × $${flightCostNum}/次` },
      { name: "校服和活动费", amount: 500, note: "校服、课外活动费用" },
      { name: "零用钱", amount: Math.round(1200 * mult), note: `周末外出、零食 ${r}` }
    );

    return costs;
  }, [selectedSchool, isBoarding, housingOption, housingCost, dayHousingChoice, flightCostNum, tripsPerYear]);

  // 一次性费用
  const oneTimeCosts: CostItem[] = useMemo(() => [
    { name: "SSAT 考试费", amount: 270, note: "报名费 + 成绩寄送" },
    { name: "TOEFL 考试费", amount: 250, note: "报名费 + 成绩寄送" },
    { name: "学校申请费", amount: applySchoolsNum * 100, note: `${applySchoolsNum} 所学校 × $100/所` },
    { name: "签证费（F-1）", amount: 350, note: "美国学生签证申请费" },
    { name: "SEVIS 费", amount: 350, note: "I-20 表格处理费" },
    { name: "材料公证和翻译", amount: 500, note: "成绩单、在读证明等" },
    { name: "面试差旅", amount: 2000, note: "如需赴美面试（可选）" },
  ], [applySchoolsNum]);

  const annualTotal = annualCosts.reduce((sum, c) => sum + c.amount, 0);
  const oneTimeTotal = oneTimeCosts.reduce((sum, c) => sum + c.amount, 0);
  const grandTotal = annualTotal * studyYears + oneTimeTotal;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">费用计算器</h1>
      <p className="text-gray-500 mb-8">
        估算美国寄宿高中留学总费用，帮你做好预算规划
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧：设置 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-20 space-y-5">
            <h2 className="font-semibold text-gray-900">📌 设置</h2>

            {/* 学校选择 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">选择学校</label>
              <select
                value={selectedSchoolId}
                onChange={(e) => setSelectedSchoolId(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>{s.nameCn} (${s.tuition.toLocaleString()})</option>
                ))}
              </select>
            </div>

            {/* 住宿方式选择 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">住宿方式</label>
              {isPureBoarding && (
                <select disabled className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500">
                  <option>寄宿（住校）</option>
                </select>
              )}
              {isPureDay && (
                <select disabled className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500">
                  <option>走读（不住校）</option>
                </select>
              )}
              {isMixed && (
                <select
                  value={mixedChoice}
                  onChange={(e) => setMixedChoice(e.target.value as "boarding" | "day")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="boarding">寄宿（住校）</option>
                  <option value="day">走读（不住校）</option>
                </select>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {isPureBoarding && "✅ 纯寄宿学校，学校政策要求所有学生住校，学费已含住宿和餐饮，无需额外支付"}
                {isPureDay && "⚠️ 纯走读学校，学校不提供住宿，国际生需自行安排寄宿家庭或租房"}
                {isMixed && "🔄 学校政策允许寄宿或走读，国际生通常选寄宿，主要看个人选择和喜好"}
              </p>
              <p className="text-xs text-gray-300 mt-1">
                💡 说明：以学校政策是否允许走读为准，而非学生比例
              </p>
            </div>

            {/* 走读时：选择住宿方案 */}
            {(isPureDay || (isMixed && mixedChoice === "day")) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">住宿方案</label>
                <select
                  value={dayHousingChoice}
                  onChange={(e) => setDayHousingChoice(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  {housingOptions.map((h) => (
                    <option key={h.value} value={h.value}>
                      {h.label} {h.cost > 0 ? `($${h.cost.toLocaleString()}/年)` : "(免费)"}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">{housingOption.note}</p>
              </div>
            )}

            {/* 就读年数 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">就读年数</label>
              <select value={studyYears} onChange={(e) => setStudyYears(Number(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value={1}>1 年</option>
                <option value={2}>2 年</option>
                <option value={3}>3 年</option>
                <option value={4}>4 年</option>
              </select>
            </div>

            {/* 每年往返次数 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">每年往返次数</label>
              <select value={tripsPerYear} onChange={(e) => setTripsPerYear(Number(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value={1}>1 次（暑假回）</option>
                <option value={2}>2 次（寒暑假回）</option>
                <option value={3}>3 次</option>
              </select>
            </div>

            {/* 单次机票价格 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">单次机票价格（美元）</label>
              <input type="number" value={flightCost} onChange={(e) => setFlightCost(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              <p className="text-xs text-gray-400 mt-1">中美往返经济舱约 $1,000-$2,000</p>
            </div>

            {/* 申请学校数量 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">申请学校数量</label>
              <input type="number" min={1} max={20} value={applySchools} onChange={(e) => setApplySchools(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
        </div>

        {/* 右侧：费用明细 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 总费用概览 */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
            <h2 className="text-lg font-semibold mb-2">💰 预估总费用</h2>
            <div className="text-4xl font-bold mb-2">${grandTotal.toLocaleString()}</div>
            <div className="text-blue-100 text-sm">{studyYears} 年总费用（含一次性费用）</div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-sm text-blue-100">年度费用</div>
                <div className="text-xl font-semibold">${annualTotal.toLocaleString()}/年</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-sm text-blue-100">一次性费用</div>
                <div className="text-xl font-semibold">${oneTimeTotal.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* 年度费用明细 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">📅 年度费用（每年）</h3>
            <div className="space-y-3">
              {annualCosts.map((cost, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{cost.name}</div>
                    <div className="text-xs text-gray-400">{cost.note}</div>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">${cost.amount.toLocaleString()}</div>
                </div>
              ))}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="font-semibold text-gray-900">年度合计</div>
                <div className="text-lg font-bold text-blue-600">${annualTotal.toLocaleString()}</div>
              </div>
            </div>

            {/* 住宿费说明 */}
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">🏠 住宿费说明</h4>
              {isBoarding ? (
                <div className="text-sm text-blue-800">
                  <p>住宿+餐饮费（估算）：≈ ${(estimatedRoomBoard + Math.round(selectedSchool.tuition * 0.1)).toLocaleString()}/年</p>
                  <p className="text-xs text-blue-600 mt-1">💡 寄宿学校学费已包含住宿和餐饮，无需额外支付</p>
                </div>
              ) : (
                <div className="text-sm text-blue-800">
                  <p>你选择的方案：{housingOption.label}</p>
                  <p>费用：{housingCost > 0 ? `≈ $${housingCost.toLocaleString()}/年` : "免费"}</p>
                  <p className="text-xs text-blue-600 mt-1">💡 {housingOption.note}</p>
                </div>
              )}
            </div>
          </div>

          {/* 费用说明 */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-800">
              💡 Hshy提醒你：学费是学校官方的，生活费是我参考各城市生活成本指数估算的，仅供参考哦～
            </p>
          </div>

          {/* 一次性费用明细 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">📋 一次性费用（申请阶段）</h3>
            <div className="space-y-3">
              {oneTimeCosts.map((cost, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{cost.name}</div>
                    <div className="text-xs text-gray-400">{cost.note}</div>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">${cost.amount.toLocaleString()}</div>
                </div>
              ))}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="font-semibold text-gray-900">一次性合计</div>
                <div className="text-lg font-bold text-purple-600">${oneTimeTotal.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* 人民币参考 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">💱 人民币参考</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500">年度费用</div>
                <div className="text-lg font-bold text-gray-900">≈ ¥{(annualTotal * 7.2).toLocaleString()}</div>
                <div className="text-xs text-gray-400">按 1:7.2 汇率</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500">{studyYears}年总费用</div>
                <div className="text-lg font-bold text-gray-900">≈ ¥{(grandTotal * 7.2).toLocaleString()}</div>
                <div className="text-xs text-gray-400">按 1:7.2 汇率</div>
              </div>
            </div>
          </div>

          {/* 注意事项 */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <h3 className="font-semibold text-amber-900 mb-2">⚠️ 注意事项</h3>
            <ul className="space-y-1.5 text-sm text-amber-800">
              <li>• 以上费用为预估值，实际费用请以学校官网为准</li>
              <li>• 学费每年可能上涨 3-5%</li>
              <li>• 部分学校提供奖学金和经济援助，可减轻负担</li>
              <li>• 机票价格受季节影响，旺季（寒暑假）会更贵</li>
              <li>• 如有课外活动（体育、音乐等），可能产生额外费用</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
