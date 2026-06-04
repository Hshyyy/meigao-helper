import { useState, useMemo } from "react";
import { schools } from "../data/schools";

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

// 根据入学年份和当前年级生成个性化时间线
function generateTimeline(
  enrollYear: number,
  _currentGrade: string
): Phase[] {
  const applyYear = enrollYear - 1; // 申请年份 = 入学年份 - 1

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
          text: "参加学校线上/线下开放日",
          tip: "大部分学校在春秋两季举办开放日",
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
          text: "报名并准备 SSAT 考试",
          tip: "建议提前 6-12 个月开始准备，可考多次取最高分",
          deadline: `${applyYear}年10月前完成`,
        },
        {
          id: "t5",
          text: "报名并准备 TOEFL 考试",
          tip: "顶尖校建议 100+，优秀校建议 90+",
          deadline: `${applyYear}年11月前完成`,
        },
        {
          id: "t6",
          text: "保持校内 GPA 稳定",
          tip: "GPA 是录取的重要参考，不能因备考而忽视",
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
          tip: "需要中英文对照版本，学校盖章",
        },
        {
          id: "t9",
          text: "整理课外活动和获奖材料",
          tip: "按时间顺序整理，突出深度而非广度",
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
          tip: "展现真实的自己，不要写套话，找人帮忙修改",
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
          text: "参加学校面试（线上或校园）",
          tip: "保持自然、自信，展现真实的自己",
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

const colorMap: Record<string, { bg: string; border: string; text: string; light: string }> = {
  blue: { bg: "bg-blue-500", border: "border-blue-200", text: "text-blue-700", light: "bg-blue-50" },
  green: { bg: "bg-green-500", border: "border-green-200", text: "text-green-700", light: "bg-green-50" },
  purple: { bg: "bg-purple-500", border: "border-purple-200", text: "text-purple-700", light: "bg-purple-50" },
  orange: { bg: "bg-orange-500", border: "border-orange-200", text: "text-orange-700", light: "bg-orange-50" },
  pink: { bg: "bg-pink-500", border: "border-pink-200", text: "text-pink-700", light: "bg-pink-50" },
  red: { bg: "bg-red-500", border: "border-red-200", text: "text-red-700", light: "bg-red-50" },
};

export default function Timeline() {
  const [enrollYear, setEnrollYear] = useState<number>(() => {
    try {
      return Number(localStorage.getItem("timelineEnrollYear")) || 2026;
    } catch {
      return 2026;
    }
  });
  const [currentGrade, setCurrentGrade] = useState<string>(() => {
    try {
      return localStorage.getItem("timelineGrade") || "初二";
    } catch {
      return "初二";
    }
  });
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
    () => generateTimeline(enrollYear, currentGrade),
    [enrollYear, currentGrade]
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

  const handleYearChange = (year: number) => {
    setEnrollYear(year);
    localStorage.setItem("timelineEnrollYear", String(year));
  };

  const handleGradeChange = (grade: string) => {
    setCurrentGrade(grade);
    localStorage.setItem("timelineGrade", grade);
  };

  const totalTasks = phases.reduce((sum, p) => sum + p.tasks.length, 0);
  const completedTasks = checkedTasks.size;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 计算距离申请截止还有多少天
  const daysUntilDeadline = useMemo(() => {
    const deadline = new Date(enrollYear, 0, 15); // 1月15日
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [enrollYear]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">申请时间线</h1>
      <p className="text-gray-500 mb-6">
        根据你的情况生成个性化申请规划
      </p>

      {/* 个性化设置 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">📌 你的情况</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              目标入学年份
            </label>
            <select
              value={enrollYear}
              onChange={(e) => handleYearChange(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value={2026}>2026 年秋季</option>
              <option value={2027}>2027 年秋季</option>
              <option value={2028}>2028 年秋季</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              目前年级
            </label>
            <select
              value={currentGrade}
              onChange={(e) => handleGradeChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option>初一</option>
              <option>初二</option>
              <option>初三</option>
              <option>高一</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              申请截止倒计时
            </label>
            <div
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                daysUntilDeadline > 180
                  ? "bg-green-50 text-green-700"
                  : daysUntilDeadline > 90
                  ? "bg-yellow-50 text-yellow-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {daysUntilDeadline > 0
                ? `还有 ${daysUntilDeadline} 天（${enrollYear}年1月15日）`
                : "申请已截止"}
            </div>
          </div>
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
                <span className="text-xs text-blue-500 ml-1">
                  截止 1月15日
                </span>
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            💡 大部分寄宿高中申请截止日期在 1 月中旬，建议提前准备
          </p>
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
