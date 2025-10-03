import GalleryViewer from "@/components/GalleryViewer";
import { getImageSets } from "@/lib/imageSets";

export const dynamic = "force-dynamic";

export default async function SlidersPage() {
  const imageSets = await getImageSets();

  return (
    <main className="min-h-screen bg-black">
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-8">
        <GalleryViewer imageSets={imageSets} />
      </section>
    </main>
  );
}
