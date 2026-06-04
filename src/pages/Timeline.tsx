import { useState } from "react";

interface TimelineItem {
  id: string;
  period: string;
  title: string;
  description: string;
  tasks: { id: string; text: string; tip?: string }[];
  color: string;
  icon: string;
}

const timelineData: TimelineItem[] = [
  {
    id: "phase1",
    period: "12-18 个月前",
    title: "规划准备期",
    description: "开始了解美国寄宿高中，确定目标学校，开始准备标化考试。",
    color: "blue",
    icon: "📋",
    tasks: [
      {
        id: "t1",
        text: "研究美国寄宿高中，了解学校特色和录取要求",
        tip: "可以利用本网站的学校库和智能选校功能",
      },
      {
        id: "t2",
        text: "确定 8-12 所目标学校（冲刺校、匹配校、保底校）",
        tip: "建议选择 2-3 所冲刺校、4-5 所匹配校、2-3 所保底校",
      },
      {
        id: "t3",
        text: "开始准备 SSAT 考试",
        tip: "SSAT 每年可考多次，建议提前 6-12 个月开始准备",
      },
      {
        id: "t4",
        text: "开始准备 TOEFL 考试",
        tip: "托福成绩有效期 2 年，注意考试时间安排",
      },
      {
        id: "t5",
        text: "参加学校开放日或线上宣讲会",
        tip: "很多学校在春秋两季举办开放日，提前预约",
      },
    ],
  },
  {
    id: "phase2",
    period: "9-12 个月前",
    title: "标化考试期",
    description: "集中精力准备和参加标化考试，同时保持校内成绩。",
    color: "green",
    icon: "📝",
    tasks: [
      {
        id: "t6",
        text: "参加 SSAT 考试（建议考 2-3 次）",
        tip: "第一次考试可以当作模考，了解自己的水平",
      },
      {
        id: "t7",
        text: "参加 TOEFL 考试（建议考 2-3 次）",
        tip: "顶尖学校通常要求 100+，优秀学校要求 90+",
      },
      {
        id: "t8",
        text: "保持校内 GPA 在 3.5 以上",
        tip: "GPA 是录取的重要参考，不能因为准备标化考试而忽视",
      },
      {
        id: "t9",
        text: "联系推荐人（班主任、学科老师）",
        tip: "建议找 2-3 位熟悉你的老师，提前沟通",
      },
      {
        id: "t10",
        text: "开始准备课外活动材料",
        tip: "整理获奖证书、活动证明、作品集等",
      },
    ],
  },
  {
    id: "phase3",
    period: "6-9 个月前",
    title: "申请准备期",
    description: "开始填写申请表，撰写申请文书，准备面试。",
    color: "purple",
    icon: "✍️",
    tasks: [
      {
        id: "t11",
        text: "填写 SAO 或学校独立申请表",
        tip: "SAO 是通用申请系统，大部分学校接受",
      },
      {
        id: "t12",
        text: "撰写申请文书（Personal Statement）",
        tip: "文书要展现真实的自己，不要写套话",
      },
      {
        id: "t13",
        text: "完成推荐信（通常需要 2-3 封）",
        tip: "提前 1-2 个月联系推荐人，给他们充足时间",
      },
      {
        id: "t14",
        text: "准备面试（线上或线下）",
        tip: "面试通常在 10-1 月进行，提前练习常见问题",
      },
      {
        id: "t15",
        text: "整理成绩单和在读证明",
        tip: "需要中英文对照版本，学校盖章",
      },
    ],
  },
  {
    id: "phase4",
    period: "3-6 个月前",
    title: "申请提交期",
    description: "提交申请材料，参加面试，等待录取结果。",
    color: "orange",
    icon: "📬",
    tasks: [
      {
        id: "t16",
        text: "提交所有申请材料（注意截止日期）",
        tip: "大部分学校截止日期在 1 月中旬，部分学校有提前批次",
      },
      {
        id: "t17",
        text: "参加学校面试（线上或校园面试）",
        tip: "面试是展示真实自己的机会，保持自然和自信",
      },
      {
        id: "t18",
        text: "跟进申请状态，确认材料完整",
        tip: "定期查看申请邮箱，及时回复学校邮件",
      },
      {
        id: "t19",
        text: "申请经济援助（如需要）",
        tip: "Need-blind 学校的援助不影响录取，建议同时申请",
      },
    ],
  },
  {
    id: "phase5",
    period: "0-3 个月前",
    title: "录取决策期",
    description: "收到录取通知，做出最终选择，准备入学。",
    color: "red",
    icon: "🎉",
    tasks: [
      {
        id: "t20",
        text: "收到录取通知，对比各学校 offer",
        tip: "综合考虑学校特色、学费、地理位置等因素",
      },
      {
        id: "t21",
        text: "确认入读学校，缴纳定金",
        tip: "定金通常在 4 月中旬前缴纳，逾期可能失去名额",
      },
      {
        id: "t22",
        text: "申请 I-20 表格，准备签证",
        tip: "收到 I-20 后预约美国签证面签",
      },
      {
        id: "t23",
        text: "参加学校新生 Orientation",
        tip: "大部分学校在 8-9 月举办新生入学活动",
      },
      {
        id: "t24",
        text: "准备行李和入学用品",
        tip: "学校通常会提供建议清单，按需准备",
      },
    ],
  },
];

export default function Timeline() {
  const [checkedTasks, setCheckedTasks] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("timelineProgress");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

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

  const totalTasks = timelineData.reduce(
    (sum, phase) => sum + phase.tasks.length,
    0
  );
  const completedTasks = checkedTasks.size;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const colorMap: Record<string, { bg: string; border: string; text: string; light: string }> = {
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
    red: {
      bg: "bg-red-500",
      border: "border-red-200",
      text: "text-red-700",
      light: "bg-red-50",
    },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">申请时间线</h1>
      <p className="text-gray-500 mb-8">
        美国寄宿高中申请全流程规划，帮你合理安排时间
      </p>

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
        {/* 中间竖线 */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

        <div className="space-y-8">
          {timelineData.map((phase) => {
            const colors = colorMap[phase.color];
            const phaseCompleted = phase.tasks.filter((t) =>
              checkedTasks.has(t.id)
            ).length;
            const phaseTotal = phase.tasks.length;

            return (
              <div key={phase.id} className="relative pl-16">
                {/* 时间节点 */}
                <div
                  className={`absolute left-3 w-7 h-7 ${colors.bg} rounded-full flex items-center justify-center text-white text-sm z-10`}
                >
                  {phase.icon}
                </div>

                {/* 内容卡片 */}
                <div
                  className={`${colors.light} rounded-xl border ${colors.border} p-5`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span
                        className={`text-xs font-medium ${colors.text} px-2 py-0.5 rounded-full ${colors.light}`}
                      >
                        {phase.period}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900 mt-1">
                        {phase.title}
                      </h3>
                    </div>
                    <span className="text-xs text-gray-400">
                      {phaseCompleted}/{phaseTotal}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    {phase.description}
                  </p>

                  {/* 任务列表 */}
                  <div className="space-y-2">
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
                          {task.tip && (
                            <p className="text-xs text-gray-400 mt-0.5">
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
      <div className="mt-10 bg-blue-50 rounded-xl p-5 text-center">
        <p className="text-sm text-blue-700">
          📌 以上时间线仅供参考，具体请根据学校官网的截止日期安排
        </p>
        <p className="text-xs text-blue-500 mt-1">
          进度会自动保存在本地，下次访问可继续
        </p>
      </div>
    </div>
  );
}
