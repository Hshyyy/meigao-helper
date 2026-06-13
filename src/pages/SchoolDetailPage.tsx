import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { schools } from "../data/schools";
import SchoolDetail from "../components/SchoolDetail";

export default function SchoolDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const school = schools.find((s) => s.id === Number(id));

  if (!school) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <Helmet>
          <title>学校未找到 — 美高选校助手</title>
        </Helmet>
        <p className="text-5xl mb-4">😅</p>
        <p className="text-xl text-gray-600 mb-4">学校未找到</p>
        <button
          onClick={() => navigate("/schools")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          返回学校库
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Helmet>
        <title>{school.nameCn} — 美高选校助手</title>
        <meta name="description" content={school.description.slice(0, 160)} />
      </Helmet>

      {/* 返回按钮 */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors shadow-md"
      >
        <span>←</span>
        <span>返回学校库</span>
      </button>

      {/* 学校详情 */}
      <SchoolDetail school={school} onClose={() => navigate(-1)} />
    </div>
  );
}
