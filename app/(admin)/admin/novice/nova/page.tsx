import Link from "next/link";
import ArticleForm from "../ArticleForm";

export default function NovaNovijaPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/novice" className="text-gray-400 hover:text-gray-600 transition-colors">
          ← Nazaj
        </Link>
        <h1 className="text-2xl font-bold text-pgd-gray">Nova novica</h1>
      </div>
      <ArticleForm />
    </div>
  );
}
