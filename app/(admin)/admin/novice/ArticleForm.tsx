"use client";

import { useActionState } from "react";
import { createArticle, updateArticle } from "@/app/_lib/actions/articles";
import type { Article } from "@/app/_lib/types";
import { Card, CardBody } from "@/app/_components/ui/Card";
import Button from "@/app/_components/ui/Button";

interface Props {
  article?: Article;
}

const initialState = { error: undefined };

export default function ArticleForm({ article }: Props) {
  const action = article
    ? updateArticle.bind(null, article.id)
    : createArticle;

  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <Card className="max-w-3xl">
      <CardBody className="p-6">
        <form action={formAction} className="space-y-5">
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
              {state.error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Naslov <span className="text-pgd-red">*</span>
            </label>
            <input
              name="title"
              type="text"
              required
              defaultValue={article?.title}
              placeholder="Naslov novice"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pgd-red"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kratek opis <span className="text-pgd-red">*</span>
            </label>
            <textarea
              name="excerpt"
              required
              rows={2}
              defaultValue={article?.excerpt}
              placeholder="Kratka vsebina za predogled..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pgd-red resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vsebina <span className="text-pgd-red">*</span>
            </label>
            <textarea
              name="content"
              required
              rows={12}
              defaultValue={article?.content}
              placeholder="Celotna vsebina novice..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pgd-red resize-y font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL slike
            </label>
            <input
              name="image_url"
              type="url"
              defaultValue={article?.image_url ?? ""}
              placeholder="https://..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pgd-red"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="published"
                value="true"
                defaultChecked={article?.published ?? false}
                className="w-4 h-4 accent-pgd-red"
              />
              <span className="text-sm font-medium text-gray-700">Takoj objavi</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={pending}>
              {article ? "Shrani spremembe" : "Objavi novico"}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
