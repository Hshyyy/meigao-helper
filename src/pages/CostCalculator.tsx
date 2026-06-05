import { useState, useMemo } from "react";
import { schools } from "../data/schools";

interface CostItem {
  name: string;
  amount: number;
  note: string;
  adjustable?: boolean;
}

export default function CostCalculator() {
  const [selectedSchoolId, setSelectedSchoolId] = useState<number>(
    schools[0].id
  );
  const [studyYears, setStudyYears] = useState(4);
  const [tripsPerYear, setTripsPerYear] = useState(2);
  const [flightCost, setFlightCost] = useState(1500);
  const [applySchools, setApplySchools] = useState(10);

  const selectedSchool = useMemo(
    () => schools.find((s) => s.id === selectedSchoolId) || schools[0],
    [selectedSchoolId]
  );

  // 年度费用
  const annualCosts: CostItem[] = useMemo(
    () => [
      {
        name: "学费（Tuition）",
        amount: selectedSchool.tuition,
        note: "包含住宿和餐饮",
      },
      {
        name: "医疗保险（Health Insurance）",
        amount: 1800,
        note: "国际学生必须购买",
      },
      {
        name: "书本和学习用品",
        amount: 800,
        note: "教科书、文具等",
      },
      {
        name: "个人开支",
        amount: 1500,
        note: "衣物、日用品、娱乐等",
      },
      {
        name: "往返机票",
        amount: flightCost * tripsPerYear,
        note: `${tripsPerYear} 次/年 × $${flightCost}/次`,
        adjustable: true,
      },
      {
        name: "校服和活动费",
        amount: 500,
        note: "校服、课外活动费用",
      },
      {
        name: "零用钱",
        amount: 1200,
        note: "周末外出、零食等",
      },
    ],
    [selectedSchool, tripsPerYear, flightCost]
  );

  // 一次性费用
  const oneTimeCosts: CostItem[] = useMemo(
    () => [
      {
        name: "SSAT 考试费",
        amount: 270,
        note: "报名费 + 成绩寄送",
      },
      {
        name: "TOEFL 考试费",
        amount: 250,
        note: "报名费 + 成绩寄送",
      },
      {
        name: "学校申请费",
        amount: applySchools * 100,
        note: `${applySchools} 所学校 × $100/所`,
        adjustable: true,
      },
      {
        name: "签证费（F-1）",
        amount: 350,
        note: "美国学生签证申请费",
      },
      {
        name: "SEVIS 费",
        amount: 350,
        note: "I-20 表格处理费",
      },
      {
        name: "材料公证和翻译",
        amount: 500,
        note: "成绩单、在读证明等",
      },
      {
        name: "面试差旅",
        amount: 2000,
        note: "如需赴美面试（可选）",
      },
    ],
    [applySchools]
  );

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                选择学校
              </label>
              <select
                value={selectedSchoolId}
                onChange={(e) => setSelectedSchoolId(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nameCn} (${s.tuition.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                就读年数
              </label>
              <select
                value={studyYears}
                onChange={(e) => setStudyYears(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value={1}>1 年</option>
                <option value={2}>2 年</option>
                <option value={3}>3 年</option>
                <option value={4}>4 年</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                每年往返次数
              </label>
              <select
                value={tripsPerYear}
                onChange={(e) => setTripsPerYear(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value={1}>1 次（暑假回）</option>
                <option value={2}>2 次（寒暑假回）</option>
                <option value={3}>3 次</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                单次机票价格（美元）
              </label>
              <input
                type="number"
                value={flightCost}
                onChange={(e) => setFlightCost(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">
                中美往返经济舱约 $1,000-$2,000
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                申请学校数量
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={applySchools}
                onChange={(e) => setApplySchools(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        {/* 右侧：费用明细 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 总费用概览 */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
            <h2 className="text-lg font-semibold mb-2">💰 预估总费用</h2>
            <div className="text-4xl font-bold mb-2">
              ${grandTotal.toLocaleString()}
            </div>
            <div className="text-blue-100 text-sm">
              {studyYears} 年总费用（含一次性费用）
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-sm text-blue-100">年度费用</div>
                <div className="text-xl font-semibold">
                  ${annualTotal.toLocaleString()}/年
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-sm text-blue-100">一次性费用</div>
                <div className="text-xl font-semibold">
                  ${oneTimeTotal.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* 年度费用明细 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">
              📅 年度费用（每年）
            </h3>
            <div className="space-y-3">
              {annualCosts.map((cost, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {cost.name}
                    </div>
                    <div className="text-xs text-gray-400">{cost.note}</div>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    ${cost.amount.toLocaleString()}
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="font-semibold text-gray-900">年度合计</div>
                <div className="text-lg font-bold text-blue-600">
                  ${annualTotal.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* 一次性费用明细 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">
              📋 一次性费用（申请阶段）
            </h3>
            <div className="space-y-3">
              {oneTimeCosts.map((cost, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {cost.name}
                    </div>
                    <div className="text-xs text-gray-400">{cost.note}</div>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    ${cost.amount.toLocaleString()}
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="font-semibold text-gray-900">一次性合计</div>
                <div className="text-lg font-bold text-purple-600">
                  ${oneTimeTotal.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* 费用说明 */}
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

          {/* 汇率换算 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">💱 人民币参考</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500">年度费用</div>
                <div className="text-lg font-bold text-gray-900">
                  ≈ ¥{(annualTotal * 7.2).toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">按 1:7.2 汇率</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500">{studyYears}年总费用</div>
                <div className="text-lg font-bold text-gray-900">
                  ≈ ¥{(grandTotal * 7.2).toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">按 1:7.2 汇率</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
