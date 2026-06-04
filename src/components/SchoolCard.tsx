import type { School } from "../data/schools";

interface Props {
  school: School;
  onClick: () => void;
  matchScore?: number;
  matchColor?: string;
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
}

const tierColors = {
  顶尖: "bg-red-100 text-red-700",
  优秀: "bg-blue-100 text-blue-700",
  热门: "bg-green-100 text-green-700",
};

export default function SchoolCard({
  school,
  onClick,
  matchScore,
  matchColor = "bg-gray-500",
  isFavorited,
  onToggleFavorite,
}: Props) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all relative"
    >
      {/* 收藏按钮 */}
      {onToggleFavorite && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="absolute top-3 left-3 text-lg"
          aria-label={isFavorited ? "取消收藏" : "收藏"}
        >
          {isFavorited ? "❤️" : "🤍"}
        </button>
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-base truncate">
            {school.nameCn}
          </h3>
          <p className="text-xs text-gray-400 truncate">{school.name}</p>
        </div>
        <div className="shrink-0 ml-2 flex flex-col items-end gap-1">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              tierColors[school.rankingTier]
            }`}
          >
            {school.rankingTier}
          </span>
          {matchScore !== undefined && (
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${matchColor}`}
            >
              匹配 {matchScore}%
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>📍 {school.state}</span>
          <span>#{school.ranking}</span>
        </div>
        <div className="flex justify-between">
          <span>💰 ${school.tuition.toLocaleString()}/年</span>
          <span>录取率 {school.acceptanceRate}%</span>
        </div>
        <div className="flex justify-between">
          <span>🌍 国际生 {school.internationalRate}%</span>
          <span>托福 {school.toeflMin}+</span>
        </div>
      </div>

      {/* 标签 */}
      <div className="flex flex-wrap gap-1 mt-3">
        {school.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
