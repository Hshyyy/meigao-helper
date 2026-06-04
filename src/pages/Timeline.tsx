import { useState, useMemo } from "react";
import { schools } from "../data/schools";

// 课程体系配置
const systems = {
  american: {
    name: "美式/AP",
    grades: [
      { value: "G7", label: "Grade 7 — 提前规划" },
      { value: "G8", label: "Grade 8 — 最佳准备期" },
      { value: "G9", label: "Grade 9 — 主要入学点 ⭐" },
      { value: "G10", label: "Grade 10 — 可申请" },
      { value: "G11", label: "Grade 11 — 少数学校接受" },
      { value: "PG", label: "Postgraduate — 第五年" },
    ],
  },
  british: {
    name: "英式/A-Level",
    grades: [
      { value: "Y7", label: "Year 7 — 提前规划" },
      { value: "Y8", label: "Year 8 — 最佳准备期" },
      { value: "Y9", label: "Year 9 — 主要入学点 ⭐" },
      { value: "Y10", label: "Year 10 — 可申请" },
      { value: "Y11", label: "Year 11 — 少数学校接受" },
      { value: "PG", label: "Postgraduate — 第五年" },
    ],
  },
  ib: {
    name: "IB",
    grades: [
      { value: "G6", label: "Grade 6 — 提前规划" },
      { value: "G7", label: "Grade 7 — 最佳准备期" },
      { value: "G8", label: "Grade 8 — 主要入学点 ⭐" },
      { value: "G9", label: "Grade 9 — 可申请" },
      { value: "G10", label: "Grade 10 — 少数学校接受" },
      { value: "PG", label: "Postgraduate — 第五年" },
    ],
  },
  chinese: {
    name: "国内课程体系",
    grades: [
      { value: "C7", label: "初一 — 提前规划" },
      { value: "C8", label: "初二 — 最佳准备期" },
      { value: "C9", label: "初三 — 主要入学点 ⭐" },
      { value: "C10", label: "高一 — 可申请" },
      { value: "C11", label: "高二 — 少数学校接受" },
      { value: "PG", label: "已毕业 — 第五年（Postgraduate）" },
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
  const [checkedTasks, setCheckedTasks] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem("timelineProgress");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
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
      const next = { ...prev };
      if (next[taskId]) {
        delete next[taskId];
      } else {
        const now = new Date();
        next[taskId] = `${now.getMonth() + 1}月${now.getDate()}日`;
      }
      localStorage.setItem("timelineProgress", JSON.stringify(next));
      return next;
    });
  };

  const totalTasks = phases.reduce((sum, p) => sum + p.tasks.length, 0);
  const completedTasks = Object.keys(checkedTasks).length;
  const progress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 下一个要做的任务
  const nextTask = useMemo(() => {
    for (const phase of phases) {
      for (const task of phase.tasks) {
        if (!checkedTasks[task.id]) {
          return task;
        }
      }
    }
    return null;
  }, [phases, checkedTasks]);

  const daysUntilDeadline = useMemo(() => {
    const deadline = new Date(enrollYear, 0, 15);
    const now = new Date();
    return Math.ceil(
      (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
  }, [enrollYear]);

  // 根据体系、年级、入学年份生成个性化提示
  const personalizedTips = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const gradeNum = parseInt(grade.replace(/[^\d]/g, ""));
    // 计算学生到达申请年级（G9）还需要几年
    const yearsToApplyingGrade = Math.max(0, 9 - gradeNum);
    // 实际可用准备时间 = 入学年份 - 当前年份 - 1（申请在入学前1年）
    const yearsUntilApply = enrollYear - currentYear - 1;
    // 有效准备时间 = 实际可用时间 - 到达申请年级的时间
    const effectiveYears = yearsUntilApply - yearsToApplyingGrade;

    // PG（第五年）特殊情况
    if (grade === "PG") {
      return {
        title: "Postgraduate（第五年）申请指南",
        items: [
          "📋 PG 年是什么：部分美高提供的一年制项目，适合已高中毕业的学生",
          "🎯 适合人群：想提升背景再申请大学、Gap Year、体育特长生、英语需要提升的学生",
          "📝 申请要求：已获得高中毕业证，SSAT/TOEFL 成绩（部分学校可豁免）",
          "⏰ 申请时间：与正常申请相同，大部分学校 1 月中旬截止",
          "🏫 可选学校：Phillips Exeter、Deerfield、Hotchkiss、Peddie 等部分学校提供 PG 年",
          "💡 特别提醒：PG 年不是所有学校都有，需要提前确认目标学校是否提供",
        ],
      };
    }

    // 紧迫程度判断（基于有效准备时间）
    const isRelaxed = effectiveYears >= 2;
    const isModerate = effectiveYears === 1;

    // 体系特定的考试信息
    const testInfo: Record<SystemKey, { name: string; target: string; alt?: string }> = {
      american: { name: "SSAT + TOEFL", target: "SSAT 85%+，TOEFL 90+" },
      british: { name: "IELTS 或 TOEFL", target: "IELTS 6.5+ 或 TOEFL 90+", alt: "部分学校接受 GCSE 替代 SSAT" },
      ib: { name: "TOEFL 或 IELTS", target: "TOEFL 90+ 或 IELTS 6.5+", alt: "IB 成绩被广泛认可，部分学校免 SSAT" },
      chinese: { name: "SSAT + TOEFL", target: "SSAT 85%+，TOEFL 90+" },
    };
    const test = testInfo[system];

    // 年级特定建议
    const gradeAdvice: Record<string, { focus: string; activities: string; tip: string }> = {
      G7: { focus: "打基础、探索兴趣", activities: "广泛尝试不同活动，找到真正热爱的方向", tip: "这是最早期的阶段，重点是培养英语能力和探索兴趣" },
      G8: { focus: "确定方向、开始准备", activities: "选定 1-2 个兴趣深入发展", tip: "现在开始了解 SSAT 考试内容，制定备考计划" },
      G9: { focus: "集中冲刺、准备申请", activities: "在 1-2 个领域做出深度，争取获奖", tip: "这是主要入学点，需要全力准备标化考试和申请材料" },
      G10: { focus: "抓紧最后机会", activities: "完善课外活动，准备申请文书", tip: "部分学校不接受 10 年级申请，需确认目标学校要求" },
      G11: { focus: "只选少数学校，精准申请", activities: "聚焦最想去的 3-5 所学校", tip: "只有少数学校接受 11 年级申请，需要非常精准" },
      Y7: { focus: "打基础、探索兴趣", activities: "广泛尝试不同活动，找到真正热爱的方向", tip: "这是最早期的阶段，重点是培养英语能力和探索兴趣" },
      Y8: { focus: "确定方向、开始准备", activities: "选定 1-2 个兴趣深入发展", tip: "现在开始了解考试内容，制定备考计划" },
      Y9: { focus: "集中冲刺、准备申请", activities: "在 1-2 个领域做出深度，争取获奖", tip: "这是主要入学点，需要全力准备标化考试和申请材料" },
      Y10: { focus: "抓紧最后机会", activities: "完善课外活动，准备申请文书", tip: "部分学校不接受 10 年级申请，需确认目标学校要求" },
      Y11: { focus: "只选少数学校，精准申请", activities: "聚焦最想去的 3-5 所学校", tip: "只有少数学校接受 11 年级申请，需要非常精准" },
      G6: { focus: "打基础、探索兴趣", activities: "广泛尝试不同活动，找到真正热爱的方向", tip: "这是最早期的阶段，重点是培养英语能力和探索兴趣" },
      C7: { focus: "打基础、探索兴趣", activities: "广泛尝试不同活动，找到真正热爱的方向", tip: "这是最早期的阶段，重点是培养英语能力和探索兴趣" },
      C8: { focus: "确定方向、开始准备", activities: "选定 1-2 个兴趣深入发展", tip: "现在开始了解 SSAT 考试内容，制定备考计划" },
      C9: { focus: "集中冲刺、准备申请", activities: "在 1-2 个领域做出深度，争取获奖", tip: "这是主要入学点，需要全力准备标化考试和申请材料" },
      C10: { focus: "抓紧最后机会", activities: "完善课外活动，准备申请文书", tip: "部分学校不接受 10 年级申请，需确认目标学校要求" },
      C11: { focus: "只选少数学校，精准申请", activities: "聚焦最想去的 3-5 所学校", tip: "只有少数学校接受 11 年级申请，需要非常精准" },
    };
    const advice = gradeAdvice[grade] || gradeAdvice["G9"];

    // 根据紧迫程度生成建议
    if (isRelaxed) {
      return {
        title: `你还有充足的准备时间 — ${advice.focus}`,
        items: [
          `📚 ${advice.tip}`,
          `🎯 标化准备：可以先做一套 ${test.name} 模考，了解自己的水平，制定长期备考计划`,
          `🏆 课外活动：${advice.activities}`,
          `🏫 学校调研：利用本站的智能选校功能，初步筛选 10-15 所感兴趣的学校`,
          `📝 成绩维护：保持校内成绩稳定，GPA 目标 3.5+（顶尖校 3.7+）`,
          `💡 特别提醒：${test.alt || "越早准备越有优势，现在开始积累英语词汇"}`,
        ],
      };
    }
    if (isModerate) {
      return {
        title: `准备时间适中 — 现在是黄金时期`,
        items: [
          `📝 ${test.name} 备考：系统学习各部分内容，建议每天 1-2 小时`,
          `📊 目标分数：${test.target}（顶尖校更高）`,
          `🏆 课外活动：${advice.activities}，争取有实质性成果`,
          `📋 推荐信：提前联系 2-3 位熟悉你的老师，给他们充足时间准备`,
          `🎤 面试准备：开始练习英文自我介绍和常见面试问题`,
          `💡 特别提醒：${test.alt || "暑假是集中冲刺的最佳时间"}`,
        ],
      };
    }
    // 紧迫
    return {
      title: `时间紧迫！需要立即行动`,
      items: [
        `⚡ 标化冲刺：立即开始 ${test.name} 模考冲刺，建议每周至少 2 次模考`,
        `📝 申请材料：同时开始准备申请文书、成绩单、推荐信`,
        `🎤 面试准备：练习英文自我介绍和常见面试问题，建议找外教模拟`,
        `📋 学校确认：最终确定 8-12 所目标学校（2-3 冲刺、4-5 匹配、2-3 保底）`,
        `⏰ 截止日期：大部分学校 1 月中旬截止，务必提前 1 个月完成所有材料`,
        `💡 特别提醒：${system === "chinese" ? "国内学生面试是全英文的，口语准备至关重要" : test.alt || "时间紧迫，每一步都要高效"}`,
      ],
    };
  }, [system, grade, enrollYear]);

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
            <p className="text-xs text-gray-400 mt-1">
              ⭐ = 主要入学点 | 已毕业学生可选"第五年（PG）"
            </p>
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
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-amber-900 mb-2">
            💡 {personalizedTips.title}
          </p>
          <ul className="space-y-1.5">
            {personalizedTips.items.map((item, index) => (
              <li key={index} className="text-sm text-amber-800">
                {item}
              </li>
            ))}
          </ul>
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
        {/* 动态反馈 */}
        <div className="mt-3">
          {progress === 100 ? (
            <p className="text-sm text-green-700 font-medium">
              🎉 恭喜！所有任务已完成，祝你申请顺利！
            </p>
          ) : nextTask ? (
            <p className="text-sm text-blue-700">
              📌 <strong>下一步：</strong>{nextTask.text}
            </p>
          ) : null}
          {completedTasks > 0 && progress < 100 && (
            <p className="text-xs text-gray-400 mt-1">
              你已完成 {completedTasks} 个任务，还剩 {totalTasks - completedTasks} 个
            </p>
          )}
        </div>
      </div>

      {/* 时间线 */}
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

        <div className="space-y-6">
          {phases.map((phase) => {
            const colors = colorMap[phase.color];
            const phaseCompleted = phase.tasks.filter(
              (t) => checkedTasks[t.id]
            ).length;
            const phaseTotal = phase.tasks.length;
            const phaseProgress = Math.round((phaseCompleted / phaseTotal) * 100);

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
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${colors.bg} rounded-full transition-all`}
                          style={{ width: `${phaseProgress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">
                        {phaseCompleted}/{phaseTotal}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {phase.tasks.map((task) => {
                      const isChecked = !!checkedTasks[task.id];
                      const completedDate = checkedTasks[task.id];

                      return (
                        <div key={task.id} className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleTask(task.id)}
                            className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <span
                              className={`text-sm ${
                                isChecked
                                  ? "text-gray-400 line-through"
                                  : "text-gray-700"
                              }`}
                            >
                              {task.text}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              {task.deadline && !isChecked && (
                                <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                                  ⏰ {task.deadline}
                                </span>
                              )}
                              {isChecked && completedDate && (
                                <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                                  ✅ {completedDate}完成
                                </span>
                              )}
                            </div>
                            {task.tip && !isChecked && (
                              <p className="text-xs text-gray-400 mt-1">
                                💡 {task.tip}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
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
