"use client";

import { useState } from "react";
import type { GalleryImage } from "@/app/_lib/types";

interface Props {
  images: GalleryImage[];
  categories: string[];
}

export default function GalleryGrid({ images, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState("Vse");
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  const filtered =
    activeCategory === "Vse"
      ? images
      : images.filter((img) => img.category === activeCategory);

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-pgd-red text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((image) => (
          <button
            key={image.id}
            onClick={() => setLightbox(image)}
            className="group aspect-square rounded-xl overflow-hidden bg-gray-100 relative block"
          >
            <img
              src={image.url}
              alt={image.caption ?? "Galerijska slika"}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {image.caption && (
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-end">
                <p className="text-white text-sm px-3 py-2 translate-y-full group-hover:translate-y-0 transition-transform">
                  {image.caption}
                </p>
              </div>
            )}
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl leading-none"
            aria-label="Zapri"
          >
            ×
          </button>
          <div
            className="max-w-4xl max-h-full flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.url}
              alt={lightbox.caption ?? ""}
              className="max-h-[80vh] max-w-full rounded-lg object-contain"
            />
            {lightbox.caption && (
              <p className="text-white text-center text-sm">{lightbox.caption}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
