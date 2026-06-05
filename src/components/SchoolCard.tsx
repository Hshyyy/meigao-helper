import type { School } from "../data/schools";
import { getEstimatedAnnualCost, getHousingNote } from "../data/schools";

interface Props {
  school: School;
  onClick: () => void;
  matchScore?: number;
  matchColor?: string;
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
  isCompared?: boolean;
  onToggleCompare?: () => void;
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
  isCompared,
  onToggleCompare,
}: Props) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all"
    >
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
          <span>💰 学费 ${school.tuition.toLocaleString()}/年</span>
          <span className="text-xs text-gray-400">{getHousingNote(school)}</span>
        </div>
        <div className="flex justify-between">
          <span>📊 预估总费用 ${getEstimatedAnnualCost(school).toLocaleString()}/年</span>
          <span>录取率 {school.acceptanceRate}%</span>
        </div>
      </div>

      {/* 标签 + 操作按钮 */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex flex-wrap gap-1">
          {school.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {onToggleCompare && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare();
              }}
              className={`text-xs px-2 py-0.5 rounded ${
                isCompared
                  ? "bg-purple-100 text-purple-700"
                  : "bg-gray-100 text-gray-500 hover:bg-purple-50 hover:text-purple-600"
              }`}
            >
              ⚖️
            </button>
          )}
          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              className="text-lg"
              aria-label={isFavorited ? "取消收藏" : "收藏"}
            >
              {isFavorited ? "❤️" : "🤍"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
