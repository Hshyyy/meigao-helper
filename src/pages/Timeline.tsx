import { useState, useMemo } from "react";
import { schools } from "../data/schools";

// 课程体系配置
const systems = {
  american: {
    name: "美式/AP",
    grades: [
      { value: "G7", label: "Grade 7（初一）" },
      { value: "G8", label: "Grade 8（初二）" },
      { value: "G9", label: "Grade 9（初三）" },
      { value: "G10", label: "Grade 10（高一）" },
      { value: "G11", label: "Grade 11（高二）" },
      { value: "G12", label: "Grade 12（高三）" },
    ],
  },
  british: {
    name: "英式/A-Level",
    grades: [
      { value: "Y7", label: "Year 7（初一）" },
      { value: "Y8", label: "Year 8（初二）" },
      { value: "Y9", label: "Year 9（初三）" },
      { value: "Y10", label: "Year 10（高一）" },
      { value: "Y11", label: "Year 11（高二）" },
      { value: "Y12", label: "Year 12（高三）" },
      { value: "Y13", label: "Year 13（高三+）" },
    ],
  },
  ib: {
    name: "IB",
    grades: [
      { value: "G6", label: "Grade 6（初一）" },
      { value: "G7", label: "Grade 7（初二）" },
      { value: "G8", label: "Grade 8（初三）" },
      { value: "G9", label: "Grade 9（高一）" },
      { value: "G10", label: "Grade 10（高二）" },
      { value: "G11", label: "Grade 11（高三）" },
      { value: "G12", label: "Grade 12（高三+）" },
    ],
  },
  chinese: {
    name: "国内课程体系",
    grades: [
      { value: "C7", label: "初一" },
      { value: "C8", label: "初二" },
      { value: "C9", label: "初三" },
      { value: "C10", label: "高一" },
      { value: "C11", label: "高二" },
      { value: "C12", label: "高三" },
    ],
  },
};

type SystemKey = keyof typeof systems;

interface Task {
  id: string;
  text: string;
  tip: string;
  deadline?: string;
}

interface Phase {
  id: string;
  title: string;
  icon: string;
  color: string;
  tasks: Task[];
}

// 根据体系、年级、入学年份生成个性化时间线
function generateTimeline(
  system: SystemKey,
  _grade: string,
  enrollYear: number
): Phase[] {
  const applyYear = enrollYear - 1;
  // 体系特定的考试建议
  const testAdvice: Record<SystemKey, { name: string; tips: string[] }> = {
    american: {
      name: "SSAT + TOEFL",
      tips: [
        "SSAT 建议提前 6-12 个月开始准备",
        "TOEFL 目标：顶尖校 100+，优秀校 90+",
        "建议考 2-3 次，取最高分",
      ],
    },
    british: {
      name: "IELTS 或 TOEFL",
      tips: [
        "部分学校接受 GCSE 英语成绩替代 SSAT",
        "IELTS 目标：顶尖校 7.0+，优秀校 6.0+",
        "提前确认目标学校是否要求 SSAT",
      ],
    },
    ib: {
      name: "TOEFL 或 IELTS",
      tips: [
        "IB 成绩被广泛认可，部分学校免 SSAT",
        "TOEFL 目标：顶尖校 100+，优秀校 90+",
        "CAS 活动经历是加分项",
      ],
    },
    chinese: {
      name: "SSAT + TOEFL",
      tips: [
        "国内学生需要重点准备 SSAT 词汇和阅读",
        "TOEFL 目标：顶尖校 100+，优秀校 90+",
        "建议每天背 50 个 SSAT 词汇",
        "暑假集中冲刺效果最好",
      ],
    },
  };

  const test = testAdvice[system];

  const phases: Phase[] = [
    {
      id: "research",
      title: "选校调研",
      icon: "🔍",
      color: "blue",
      tasks: [
        {
          id: "t1",
          text: "确定目标学校清单（建议 8-12 所）",
          tip: "利用本站的智能选校功能，筛选冲刺校、匹配校、保底校",
        },
        {
          id: "t2",
          text: "了解各校的录取要求和特色",
          tip: "点击学校详情查看学术特色、申请建议等",
        },
        {
          id: "t3",
          text: `确认目标学校对${systems[system].name}学生的具体要求`,
          tip:
            system === "british"
              ? "部分学校接受 GCSE 替代 SSAT，提前确认"
              : system === "ib"
              ? "IB 成绩被广泛认可，确认是否需要 SSAT"
              : "大部分学校要求 SSAT 和 TOEFL",
        },
      ],
    },
    {
      id: "test",
      title: "标化考试",
      icon: "📝",
      color: "green",
      tasks: [
        {
          id: "t4",
          text: `准备并参加 ${test.name} 考试`,
          tip: test.tips[0],
          deadline: `${applyYear}年10月前完成`,
        },
        {
          id: "t5",
          text: "保持校内成绩稳定",
          tip:
            system === "chinese"
              ? "GPA 需要换算成 4.0 制，建议保持在 3.5 以上"
              : system === "ib"
              ? "IB 预测成绩很重要，保持在 35+ 以上"
              : system === "british"
              ? "GCSE/A-Level 预测成绩是重要参考"
              : "GPA 保持在 3.5 以上",
        },
        {
          id: "t6",
          text: "准备语言考试（如需要）",
          tip: test.tips.slice(1).join("；"),
          deadline: `${applyYear}年11月前完成`,
        },
      ],
    },
    {
      id: "material",
      title: "材料准备",
      icon: "📋",
      color: "purple",
      tasks: [
        {
          id: "t7",
          text: "联系推荐人（班主任、学科老师）",
          tip: "建议找 2-3 位熟悉你的老师，提前 1-2 个月沟通",
          deadline: `${applyYear}年9月前确认`,
        },
        {
          id: "t8",
          text: "准备成绩单和在读证明",
          tip:
            system === "chinese"
              ? "需要中英文对照版本，学校盖章，GPA 需换算"
              : "准备英文版成绩单，学校盖章",
        },
        {
          id: "t9",
          text: "整理课外活动和获奖材料",
          tip:
            system === "ib"
              ? "CAS 活动经历是加分项，重点整理"
              : "按时间顺序整理，突出深度而非广度",
        },
      ],
    },
    {
      id: "apply",
      title: "申请提交",
      icon: "✍️",
      color: "orange",
      tasks: [
        {
          id: "t10",
          text: "填写 SAO 或学校独立申请表",
          tip: "SAO 是通用申请系统，大部分学校接受",
        },
        {
          id: "t11",
          text: "撰写申请文书",
          tip:
            system === "chinese"
              ? "展现真实的自己，找英语好的人帮忙润色"
              : "展现真实的自己，不要写套话",
        },
        {
          id: "t12",
          text: "提交所有申请材料",
          tip: "大部分学校截止日期在 1 月中旬",
          deadline: `${enrollYear}年1月15日前`,
        },
      ],
    },
    {
      id: "interview",
      title: "面试准备",
      icon: "🎤",
      color: "pink",
      tasks: [
        {
          id: "t13",
          text: "准备面试常见问题",
          tip: "为什么选择这所学校？你的优势是什么？你的兴趣爱好？",
        },
        {
          id: "t14",
          text:
            system === "chinese"
              ? "强化英语口语，准备英文面试"
              : "参加学校面试（线上或校园）",
          tip:
            system === "chinese"
              ? "面试是全英文的，建议找外教模拟练习"
              : "保持自然、自信，展现真实的自己",
          deadline: `${applyYear}年11月-${enrollYear}年2月`,
        },
      ],
    },
    {
      id: "result",
      title: "录取决策",
      icon: "🎉",
      color: "red",
      tasks: [
        {
          id: "t15",
          text: "收到录取通知，对比各校 offer",
          tip: "综合考虑学校特色、学费、地理位置等因素",
          deadline: `${enrollYear}年3月10日前后`,
        },
        {
          id: "t16",
          text: "确认入读学校，缴纳定金",
          tip: "定金通常在 4 月中旬前缴纳",
          deadline: `${enrollYear}年4月10日前`,
        },
        {
          id: "t17",
          text: "申请 I-20，准备签证",
          tip: "收到 I-20 后预约美国签证面签",
        },
        {
          id: "t18",
          text: "参加新生 Orientation",
          tip: "大部分学校在 8-9 月举办",
          deadline: `${enrollYear}年8-9月`,
        },
      ],
    },
  ];

  return phases;
}

const colorMap: Record<
  string,
  { bg: string; border: string; text: string; light: string }
> = {
  blue: {
    bg: "bg-blue-500",
    border: "border-blue-200",
    text: "text-blue-700",
    light: "bg-blue-50",
  },
  green: {
    bg: "bg-green-500",
    border: "border-green-200",
    text: "text-green-700",
    light: "bg-green-50",
  },
  purple: {
    bg: "bg-purple-500",
    border: "border-purple-200",
    text: "text-purple-700",
    light: "bg-purple-50",
  },
  orange: {
    bg: "bg-orange-500",
    border: "border-orange-200",
    text: "text-orange-700",
    light: "bg-orange-50",
  },
  pink: {
    bg: "bg-pink-500",
    border: "border-pink-200",
    text: "text-pink-700",
    light: "bg-pink-50",
  },
  red: {
    bg: "bg-red-500",
    border: "border-red-200",
    text: "text-red-700",
    light: "bg-red-50",
  },
};

export default function Timeline() {
  const [system, setSystem] = useState<SystemKey>("chinese");
  const [grade, setGrade] = useState("C9");
  const [enrollYear, setEnrollYear] = useState(2026);
  const [checkedTasks, setCheckedTasks] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("timelineProgress");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const favorites: number[] = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch {
      return [];
    }
  }, []);

  const favoriteSchools = schools.filter((s) => favorites.includes(s.id));

  const phases = useMemo(
    () => generateTimeline(system, grade, enrollYear),
    [system, grade, enrollYear]
  );

  const toggleTask = (taskId: string) => {
    setCheckedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      localStorage.setItem(
        "timelineProgress",
        JSON.stringify(Array.from(next))
      );
      return next;
    });
  };

  const totalTasks = phases.reduce((sum, p) => sum + p.tasks.length, 0);
  const completedTasks = checkedTasks.size;
  const progress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const daysUntilDeadline = useMemo(() => {
    const deadline = new Date(enrollYear, 0, 15);
    const now = new Date();
    return Math.ceil(
      (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
  }, [enrollYear]);

  // 根据体系和年级生成个性化提示
  const personalizedTip = useMemo(() => {
    const gradeNum = parseInt(grade.replace(/[^\d]/g, ""));
    const yearsLeft = 12 - gradeNum + 1;

    if (system === "chinese") {
      if (yearsLeft >= 3)
        return "你还有充足时间，建议现在开始积累英语词汇，培养课外活动兴趣";
      if (yearsLeft >= 2)
        return "现在是准备 SSAT/TOEFL 的黄金时期，建议系统性备考";
      return "时间紧迫！需要立即开始标化考试冲刺，同时准备申请材料";
    }
    if (system === "british") {
      if (yearsLeft >= 3)
        return "你还有充足时间，建议先确认目标学校是否要求 SSAT，同时保持 GCSE 成绩";
      if (yearsLeft >= 2)
        return "部分学校接受 GCSE 替代 SSAT，建议提前确认目标学校要求";
      return "时间紧迫！立即确认目标学校要求，准备 IELTS 或 TOEFL";
    }
    if (system === "ib") {
      if (yearsLeft >= 3)
        return "你还有充足时间，IB 成绩被广泛认可，保持好校内成绩是关键";
      if (yearsLeft >= 2)
        return "IB 成绩被广泛认可，部分学校免 SSAT，重点准备 TOEFL";
      return "时间紧迫！确认目标学校是否需要 SSAT，重点准备 TOEFL";
    }
    // american
    if (yearsLeft >= 3)
      return "你还有充足时间，建议现在开始 SSAT 词汇积累，培养课外活动";
    if (yearsLeft >= 2)
      return "现在是准备 SSAT/TOEFL 的黄金时期，10 年级暑假集中冲刺";
    return "时间紧迫！立即开始标化考试冲刺，同时准备申请材料";
  }, [system, grade]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">申请时间线</h1>
      <p className="text-gray-500 mb-6">
        根据你的课程体系和年级，生成个性化申请规划
      </p>

      {/* 个性化设置 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">📌 你的情况</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              课程体系
            </label>
            <select
              value={system}
              onChange={(e) => {
                const s = e.target.value as SystemKey;
                setSystem(s);
                setGrade(systems[s].grades[0].value);
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              {Object.entries(systems).map(([key, s]) => (
                <option key={key} value={key}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              目前年级
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              {systems[system].grades.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              目标入学年份
            </label>
            <select
              value={enrollYear}
              onChange={(e) => setEnrollYear(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value={2026}>2026 年秋季</option>
              <option value={2027}>2027 年秋季</option>
              <option value={2028}>2028 年秋季</option>
            </select>
          </div>
        </div>

        {/* 个性化提示 */}
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-sm text-amber-800">
            💡 <strong>给你的建议：</strong>
            {personalizedTip}
          </p>
        </div>

        {/* 倒计时 */}
        <div className="mt-3 flex items-center gap-4">
          <span
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              daysUntilDeadline > 180
                ? "bg-green-50 text-green-700"
                : daysUntilDeadline > 90
                ? "bg-yellow-50 text-yellow-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {daysUntilDeadline > 0
              ? `⏰ 距申请截止还有 ${daysUntilDeadline} 天`
              : "申请已截止"}
          </span>
          <span className="text-xs text-gray-400">
            截止日期：{enrollYear}年1月15日
          </span>
        </div>
      </div>

      {/* 收藏的学校 */}
      {favoriteSchools.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">
            ❤️ 你收藏的学校
          </h2>
          <div className="flex flex-wrap gap-2">
            {favoriteSchools.map((school) => (
              <span
                key={school.id}
                className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full"
              >
                {school.nameCn}
                <span className="text-xs text-blue-500 ml-1">截止 1月15日</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 进度条 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">申请进度</span>
          <span className="text-sm text-gray-500">
            {completedTasks}/{totalTasks} 项任务已完成
          </span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {progress === 100
            ? "🎉 恭喜！所有任务已完成，祝你申请顺利！"
            : progress >= 50
            ? "💪 进度过半，继续保持！"
            : "🚀 开始你的申请之旅吧！"}
        </p>
      </div>

      {/* 时间线 */}
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

        <div className="space-y-6">
          {phases.map((phase) => {
            const colors = colorMap[phase.color];
            const phaseCompleted = phase.tasks.filter((t) =>
              checkedTasks.has(t.id)
            ).length;
            const phaseTotal = phase.tasks.length;

            return (
              <div key={phase.id} className="relative pl-16">
                <div
                  className={`absolute left-3 w-7 h-7 ${colors.bg} rounded-full flex items-center justify-center text-white text-sm z-10`}
                >
                  {phase.icon}
                </div>

                <div
                  className={`${colors.light} rounded-xl border ${colors.border} p-5`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {phase.title}
                    </h3>
                    <span className="text-xs text-gray-400">
                      {phaseCompleted}/{phaseTotal}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {phase.tasks.map((task) => (
                      <div key={task.id} className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={checkedTasks.has(task.id)}
                          onChange={() => toggleTask(task.id)}
                          className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <span
                            className={`text-sm ${
                              checkedTasks.has(task.id)
                                ? "text-gray-400 line-through"
                                : "text-gray-700"
                            }`}
                          >
                            {task.text}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                            {task.deadline && (
                              <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                                ⏰ {task.deadline}
                              </span>
                            )}
                          </div>
                          {task.tip && (
                            <p className="text-xs text-gray-400 mt-1">
                              💡 {task.tip}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 底部提示 */}
      <div className="mt-8 bg-blue-50 rounded-xl p-5 text-center">
        <p className="text-sm text-blue-700">
          📌 以上时间线根据你的情况自动生成，具体请以学校官网为准
        </p>
        <p className="text-xs text-blue-500 mt-1">
          进度会自动保存在本地，下次访问可继续
        </p>
      </div>
    </div>
  );
}
