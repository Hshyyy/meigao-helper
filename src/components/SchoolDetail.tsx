import type { School } from "../data/schools";

interface Props {
  school: School;
  onClose: () => void;
}

export default function SchoolDetail({ school, onClose }: Props) {
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
            <h2 className="text-xl font-bold text-gray-900">
              {school.nameCn}
            </h2>
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
          {/* 基本信息 */}
          <div className="grid grid-cols-2 gap-3">
            <InfoItem label="地区" value={`${school.state} ${school.city}`} />
            <InfoItem label="排名" value={`#${school.ranking}`} />
            <InfoItem label="类型" value={school.type} />
            <InfoItem label="年级" value={school.grades} />
            <InfoItem
              label="年学费"
              value={`$${school.tuition.toLocaleString()}`}
            />
            <InfoItem
              label="学生总数"
              value={`${school.studentCount} 人`}
            />
            <InfoItem label="师生比" value={school.studentTeacherRatio} />
            <InfoItem
              label="国际生比例"
              value={`${school.internationalRate}%`}
            />
          </div>

          {/* 录取要求 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              📊 录取要求
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">录取率</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${school.acceptanceRate}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-10 text-right">
                    {school.acceptanceRate}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">建议托福</span>
                <span className="text-sm font-medium text-gray-900">
                  {school.toeflMin}+
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  建议 SSAT 百分位
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {school.ssatPercentile}%+
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">建议 GPA</span>
                <span className="text-sm font-medium text-gray-900">
                  {school.gpaMin}+
                </span>
              </div>
            </div>
          </div>

          {/* 特色亮点 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">✨ 特色亮点</h3>
            <div className="flex flex-wrap gap-2">
              {school.highlights.map((h) => (
                <span
                  key={h}
                  className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full"
                >
                  {h}
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
