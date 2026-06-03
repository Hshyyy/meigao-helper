import type { School } from "../data/schools";

interface Props {
  school: School;
  onClick: () => void;
}

const tierColors = {
  顶尖: "bg-red-100 text-red-700",
  优秀: "bg-blue-100 text-blue-700",
  热门: "bg-green-100 text-green-700",
};

export default function SchoolCard({ school, onClick }: Props) {
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
        <span
          className={`shrink-0 ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
            tierColors[school.rankingTier]
          }`}
        >
          {school.rankingTier}
        </span>
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

      <div className="flex flex-wrap gap-1 mt-3">
        {school.highlights.slice(0, 2).map((h) => (
          <span
            key={h}
            className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded"
          >
            {h}
          </span>
        ))}
      </div>
    </div>
  );
}
