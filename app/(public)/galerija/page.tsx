import type { Metadata } from "next";
import { createClient } from "@/app/_lib/supabase/server";
import type { GalleryImage } from "@/app/_lib/types";
import SectionTitle from "@/app/_components/ui/SectionTitle";
import GalleryGrid from "./GalleryGrid";

export const metadata: Metadata = {
  title: "Galerija",
  description: "Fotogalerija Prostovoljnega gasilskega društva Nova vas.",
};

export default async function GalerijaPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery_images")
    .select("*")
    .order("created_at", { ascending: false });

  const images = (data ?? []) as GalleryImage[];
  const categories = ["Vse", ...Array.from(new Set(images.map((i) => i.category).filter(Boolean) as string[]))];

  return (
    <div>
      <section className="bg-pgd-gray text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Galerija</h1>
          <p className="text-gray-300 text-lg">Fotografije z naših vaj, intervencij in dogodkov.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {images.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">📷</div>
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Galerija je prazna</h2>
            <p className="text-gray-400">Fotografije bodo kmalu objavljene.</p>
          </div>
        ) : (
          <GalleryGrid images={images} categories={categories} />
        )}
      </section>
    </div>
  );
}
