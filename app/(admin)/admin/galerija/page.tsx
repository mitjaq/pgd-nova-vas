import { createClient } from "@/app/_lib/supabase/server";
import type { GalleryImage } from "@/app/_lib/types";
import { Card, CardBody } from "@/app/_components/ui/Card";
import AddImageForm from "./AddImageForm";
import DeleteImageButton from "./DeleteImageButton";

export default async function AdminGalerijaPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery_images")
    .select("*")
    .order("created_at", { ascending: false });

  const images = (data ?? []) as GalleryImage[];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-pgd-gray">Galerija</h1>
        <p className="text-gray-500 mt-1">{images.length} fotografij skupaj</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardBody className="p-6">
              <h2 className="font-semibold text-pgd-gray mb-4">Dodaj fotografijo</h2>
              <AddImageForm />
            </CardBody>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {images.length === 0 ? (
            <Card>
              <CardBody className="text-center py-12">
                <div className="text-4xl mb-3">📷</div>
                <p className="text-gray-500">Galerija je prazna.</p>
              </CardBody>
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={image.url}
                      alt={image.caption ?? ""}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {image.caption && (
                    <p className="text-xs text-gray-500 mt-1 truncate">{image.caption}</p>
                  )}
                  <div className="absolute top-2 right-2">
                    <DeleteImageButton id={image.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
