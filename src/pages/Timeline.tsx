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

    // 基于申请截止日期计算剩余时间
    const applyDeadline = new Date(enrollYear - 1, 0, 15); // 申请截止：入学前一年1月15日
    const daysUntilDeadline = Math.ceil((applyDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const monthsLeft = Math.max(0, Math.round(daysUntilDeadline / 30));
    const effectiveYears = Math.floor(monthsLeft / 12);

    // 如果申请已截止，直接返回
    if (daysUntilDeadline <= 0) {
      // 动态计算下一个可用的入学年份
      let nextYear = enrollYear + 1;
      while (true) {
        const nextDeadline = new Date(nextYear - 1, 0, 15);
        const nextDays = Math.ceil((nextDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (nextDays > 0) break;
        nextYear++;
      }
      return {
        title: "申请已截止",
        items: [
          `📚 ${enrollYear} 年秋季入学的申请截止日期（${enrollYear - 1} 年 1 月 15 日）已过`,
          `⚠️ 请选择更晚的入学年份`,
          `💡 提示：大部分寄宿高中的申请截止日期在入学前一年的 1 月中旬`,
          `🎯 最近可选入学年份：${nextYear} 年秋季（截止日期 ${nextYear - 1} 年 1 月 15 日）`,
          `📝 如有疑问，请联系学校招生办确认是否还有补录机会`,
        ],
      };
    }

    // 格式化时间显示
    const formatTime = () => {
      if (daysUntilDeadline < 30) return `${daysUntilDeadline} 天`;
      if (monthsLeft < 12) return `${monthsLeft} 个月`;
      const years = Math.floor(monthsLeft / 12);
      const remainMonths = monthsLeft % 12;
      return remainMonths > 0 ? `${years} 年 ${remainMonths} 个月` : `${years} 年`;
    };
    const timeStr = formatTime();

    // PG 特殊情况
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

    // 1. 体系维度 - 考试和优势
    const systemData: Record<SystemKey, { test: string; advantage: string; special: string }> = {
      american: { test: "SSAT + TOEFL", advantage: "美式体系学生在课外活动和 GPA 方面有天然优势", special: "保持 GPA 3.5+，深入发展课外活动" },
      british: { test: "IELTS 或 TOEFL", advantage: "英式体系学生在写作和批判性思维方面有优势", special: "部分学校接受 GCSE 替代 SSAT，先确认目标学校要求" },
      ib: { test: "TOEFL 或 IELTS", advantage: "IB 学生在跨学科思考和国际视野方面有优势", special: "IB 成绩被广泛认可，部分学校免 SSAT" },
      chinese: { test: "SSAT + TOEFL", advantage: "国内学生基础扎实，数理化成绩通常优秀", special: "重点提升英语能力，SSAT 词汇和阅读是关键" },
    };
    const sys = systemData[system];

    // 2. 根据年级+入学年份组合生成具体建议
    const gradeNumMap: Record<string, number> = {
      G7: 7, G8: 8, G9: 9, G10: 10, G11: 11,
      Y7: 7, Y8: 8, Y9: 9, Y10: 10, Y11: 11,
      G6: 6, C7: 7, C8: 8, C9: 9, C10: 10, C11: 11,
    };
    const gn = gradeNumMap[grade] || 9;

    // 根据剩余时间动态调整目标分数和学习强度
    let ssatTarget: string;
    let toeflTarget: string;
    let dailyHours: string;
    let weeklyMock: string;

    if (monthsLeft >= 36) {
      ssatTarget = "70%+"; toeflTarget = "70+"; dailyHours = "30 分钟"; weeklyMock = "不用模考";
    } else if (monthsLeft >= 24) {
      ssatTarget = "75%+"; toeflTarget = "80+"; dailyHours = "1 小时"; weeklyMock = "每月 1 次";
    } else if (monthsLeft >= 18) {
      ssatTarget = "80%+"; toeflTarget = "85+"; dailyHours = "1.5 小时"; weeklyMock = "每月 2 次";
    } else if (monthsLeft >= 12) {
      ssatTarget = "85%+"; toeflTarget = "90+"; dailyHours = "2 小时"; weeklyMock = "每周 1 次";
    } else if (monthsLeft >= 6) {
      ssatTarget = "85%+"; toeflTarget = "90+"; dailyHours = "2.5 小时"; weeklyMock = "每周 2 次";
    } else {
      ssatTarget = "90%+"; toeflTarget = "95+"; dailyHours = "3 小时"; weeklyMock = "每周 3 次";
    }

    // 如果有效准备时间为负，说明入学年份太近或已过
    if (effectiveYears < 0) {
      return {
        title: "入学年份已过或太近",
        items: [
          `📚 你选择的 ${enrollYear} 年秋季入学，申请截止日期（${enrollYear - 1} 年 1 月 15 日）已过或即将到来`,
          `⚠️ 建议：将入学年份调整为 ${enrollYear + 1} 年或更晚`,
          `💡 提示：大部分学校申请截止日期在入学前一年的 1 月中旬`,
          `🎯 ${sys.special}`,
          `📝 标化：${sys.test}`,
          `⏰ 请重新选择入学年份，系统会为你生成合适的申请计划`,
        ],
      };
    }

    // 动态生成标题和建议
    let title: string;
    let items: string[];

    // G7（初一）
    if (gn === 7 && monthsLeft >= 48) {
      title = `超前规划 · 还有 ${timeStr}`;
      items = [
        `📚 你目前初一，距离申请还有 ${timeStr}，完全不用着急`,
        `📝 英语：看英文动画片、读英文绘本（推荐《Magic Tree House》），每天 20 分钟培养语感`,
        `🎯 ${sys.special}`,
        `🏆 活动：广泛尝试各种活动——游泳、钢琴、编程、绘画、志愿者，找到真正喜欢的`,
        `🏫 调研：浏览本站学校库，收藏感兴趣的学校`,
        `💡 ${sys.advantage}`,
      ];
    } else if (gn === 7 && monthsLeft >= 36) {
      title = `基础积累 · 还有 ${timeStr}`;
      items = [
        `📚 你目前初一，还有 ${timeStr}，开始接触标化考试`,
        `📝 SSAT：每周做 1-2 篇阅读理解，熟悉题型，目标分数 ${ssatTarget}`,
        `📝 TOEFL：每天听 15 分钟英文播客，培养听力`,
        `🎯 ${sys.special}`,
        `🏆 活动：从广泛尝试转向 2-3 个方向，开始积累`,
        `💡 ${sys.advantage}`,
      ];
    } else if (gn === 7 && monthsLeft >= 24) {
      title = `系统备考 · 还有 ${timeStr}`;
      items = [
        `📚 你目前初一，还有 ${timeStr}，需要开始系统备考`,
        `📝 SSAT：每天背 50 个词汇，周末做 1 套阅读，目标 ${ssatTarget}`,
        `📝 TOEFL：每天听 20 分钟英文，练习跟读`,
        `🎯 ${sys.special}`,
        `🏆 活动：选定 1-2 个方向深入，参加比赛`,
        `📋 推荐信：与老师建立良好关系`,
      ];
    } else if (gn === 7 && monthsLeft >= 12) {
      title = `加速冲刺 · 只剩 ${timeStr}！`;
      items = [
        `📚 你目前初一，只剩 ${timeStr}，需要全力加速`,
        `📝 SSAT：每天 ${dailyHours}，词汇+阅读+数学同步推进，目标 ${ssatTarget}`,
        `📝 TOEFL：每天 1 小时听力口语，目标 ${toeflTarget}`,
        `🎯 ${sys.special}`,
        `🏆 活动：快速聚焦 1-2 个方向，争取出成果`,
        `🎤 面试：开始练习英文自我介绍，每天 15 分钟`,
        `⏰ ${weeklyMock}模考`,
      ];
    } else if (gn === 7) {
      title = `紧急状态 · 只剩 ${timeStr}！`;
      items = [
        `📚 你目前初一，只剩 ${timeStr}，建议调整入学年份`,
        `⚠️ 初一学生通常申请 2-3 年后入学，当前时间不足`,
        `📝 如果坚持：每天 ${dailyHours} 高强度备考，目标 SSAT ${ssatTarget}`,
        `🎯 ${sys.special}`,
        `📋 学校：确认哪些学校接受低年级申请`,
        `⏰ ${weeklyMock}模考`,
      ];
    }
    // G8（初二）
    else if (gn === 8 && monthsLeft >= 36) {
      title = `从容准备 · 还有 ${timeStr}`;
      items = [
        `📚 你目前初二，还有 ${timeStr}，可以从容准备`,
        `📝 SSAT：每天背 30 个词汇，读英文小说，目标 ${ssatTarget}`,
        `📝 TOEFL：每天听 15 分钟英文，培养语感`,
        `🎯 ${sys.special}`,
        `🏆 活动：广泛尝试，找到 2-3 个兴趣方向`,
        `💡 ${sys.advantage}`,
      ];
    } else if (gn === 8 && monthsLeft >= 24) {
      title = `黄金准备 · 还有 ${timeStr}`;
      items = [
        `📚 你目前初二，还有 ${timeStr}，最佳起步时间`,
        `📝 SSAT：每天 ${dailyHours}，词汇+阅读+数学，目标 ${ssatTarget}`,
        `📝 TOEFL：每天 30 分钟听力口语，目标 ${toeflTarget}`,
        `🎯 ${sys.special}`,
        `🏆 活动：选定 1-2 个方向深入，参加比赛`,
        `📋 推荐信：与老师建立关系`,
      ];
    } else if (gn === 8 && monthsLeft >= 12) {
      title = `紧迫冲刺 · 只剩 ${timeStr}！`;
      items = [
        `📚 你目前初二，只剩 ${timeStr}，必须高效行动`,
        `📝 SSAT：每天 ${dailyHours}，暑假集中突破，目标 ${ssatTarget}`,
        `📝 TOEFL：每天 1 小时，目标 ${toeflTarget}`,
        `🎯 ${sys.special}`,
        `🏆 活动：快速完善课外活动`,
        `🎤 面试：开始练习英文面试`,
        `⏰ ${weeklyMock}模考`,
      ];
    } else if (gn === 8) {
      title = `紧急状态 · 只剩 ${timeStr}！`;
      items = [
        `📚 你目前初二，只剩 ${timeStr}，建议调整入学年份`,
        `⚠️ 初二学生通常申请 1-2 年后入学`,
        `📝 如果坚持：每天 ${dailyHours} 高强度冲刺，目标 SSAT ${ssatTarget}`,
        `🎯 ${sys.special}`,
        `⏰ ${weeklyMock}模考`,
      ];
    }
    // G9（初三）
    else if (gn === 9 && monthsLeft >= 36) {
      title = `主要入学点 · 充裕准备 · 还有 ${timeStr}`;
      items = [
        `📚 你目前初三，主要入学点，还有 ${timeStr}准备`,
        `📝 SSAT：系统学习，每天 ${dailyHours}，目标 ${ssatTarget}`,
        `📝 TOEFL：重点提升听力口语，目标 ${toeflTarget}`,
        `🎯 ${sys.special}`,
        `🏆 活动：深入发展 1-2 个领域，争取获奖`,
        `📋 推荐信：正式联系 2-3 位老师`,
      ];
    } else if (gn === 9 && monthsLeft >= 24) {
      title = `主要入学点 · 黄金期 · 还有 ${timeStr}`;
      items = [
        `📚 你目前初三，主要入学点，还有 ${timeStr}`,
        `📝 SSAT：每天 ${dailyHours}，目标 ${ssatTarget}，${weeklyMock}模考`,
        `📝 TOEFL：每天 1 小时，目标 ${toeflTarget}`,
        `🎯 ${sys.special}`,
        `🏆 活动：在 1-2 个领域做出深度`,
        `📋 推荐信：正式联系老师`,
        `🎤 面试：开始练习英文自我介绍`,
      ];
    } else if (gn === 9 && monthsLeft >= 12) {
      title = `主要入学点 · 冲刺期 · 只剩 ${timeStr}！`;
      items = [
        `📚 你目前初三，主要入学点，只剩 ${timeStr}！`,
        `📝 SSAT：每天 ${dailyHours}，目标 ${ssatTarget}，${weeklyMock}模考`,
        `📝 TOEFL：每天 1 小时，目标 ${toeflTarget}，口语每天练习`,
        `🎯 ${sys.special}`,
        `📝 材料：同时准备文书、成绩单、推荐信`,
        `🎤 面试：每天练习，建议找外教模拟`,
        `⏰ 申请截止 ${enrollYear - 1} 年 1 月 15 日`,
      ];
    } else if (gn === 9) {
      title = `主要入学点 · 决战 · 只剩 ${timeStr}！`;
      items = [
        `📚 你目前初三，主要入学点，只剩 ${timeStr}！`,
        `⚡ SSAT：每天 ${dailyHours} 高强度冲刺，目标 ${ssatTarget}，${weeklyMock}模考`,
        `⚡ TOEFL：每天 2 小时，目标 ${toeflTarget}`,
        `🎯 ${sys.special}`,
        `📝 材料：立即准备所有申请材料`,
        `🎤 面试：找外教每天模拟`,
        `⏰ 申请截止 ${enrollYear - 1} 年 1 月 15 日`,
      ];
    }
    // G10（高一）
    else if (gn === 10 && monthsLeft >= 24) {
      title = `最后机会 · 还有 ${timeStr}`;
      items = [
        `📚 你目前高一，最后机会，还有 ${timeStr}`,
        `📝 SSAT：确认已有 ${ssatTarget} 成绩，或开始备考`,
        `📝 TOEFL：确认已有 ${toeflTarget} 成绩，或开始冲刺`,
        `🎯 ${sys.special}`,
        `📋 学校：确认目标学校是否接受 10 年级`,
        `🏆 活动：完善履历，准备文书`,
      ];
    } else if (gn === 10 && monthsLeft >= 12) {
      title = `最后机会 · 只剩 ${timeStr}！`;
      items = [
        `📚 你目前高一，只剩 ${timeStr}！`,
        `📝 SSAT：必须已有或立即冲刺，目标 ${ssatTarget}，${weeklyMock}模考`,
        `📝 TOEFL：必须已有或立即冲刺，目标 ${toeflTarget}`,
        `🎯 ${sys.special}`,
        `📋 学校：只选接受 10 年级的学校`,
        `🎤 面试：立即准备`,
      ];
    } else if (gn === 10) {
      title = `最后机会 · 紧急！只剩 ${timeStr}！`;
      items = [
        `📚 你目前高一，只剩 ${timeStr}！建议调整入学年份`,
        `⚠️ 高一学生通常申请 1-2 年后入学`,
        `📝 如果坚持：每天 ${dailyHours} 冲刺 SSAT+TOEFL`,
        `🎯 ${sys.special}`,
        `📋 学校：精准选择接受 10 年级的学校`,
      ];
    }
    // G11（高二）
    else if (gn === 11) {
      title = `极紧迫 · 只有少数学校可选`;
      items = [
        `📚 你目前高二，大部分学校不接受 11 年级`,
        `📋 学校：只有少数学校接受，需精准选择`,
        `📝 标化：必须已有 SSAT ${ssatTarget} 和 TOEFL ${toeflTarget}`,
        `🎯 ${sys.special}`,
        `🏆 活动：聚焦最想去的 3-5 所学校`,
      ];
    }
    // 默认
    else {
      title = `规划中 · 还有 ${timeStr}`;
      items = [
        `📚 建议调整年级或入学年份`,
        `💡 大部分学生在初三（G9）申请美高`,
        `📝 标化：${sys.test}，目标 SSAT ${ssatTarget}，TOEFL ${toeflTarget}`,
        `🎯 ${sys.special}`,
        `⏰ 目标 ${enrollYear} 年秋季入学`,
      ];
    }

    return { title, items };
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
