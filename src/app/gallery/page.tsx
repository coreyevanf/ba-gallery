import Link from "next/link";
import Image from "next/image";
import { getGallerySets } from "@/lib/imageSets";
import styles from "./gallery.module.css";
import GalleryGrid, { type GalleryImage } from "./GalleryGrid";

export const dynamic = "force-dynamic";

function formatTitle(name: string) {
  const withoutExtension = name.replace(/\.[^/.]+$/, "");
  const cleaned = withoutExtension.replace(/[\s_-]+/g, " ").trim();
  if (!cleaned) return "Gallery Image";
  return cleaned
    .split(" ")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function buildDescription(setName: string, index: number) {
  return `${setName} • Image ${index + 1}`;
}

export default async function GalleryPage() {
  const gallerySets = await getGallerySets();

  const preparedSets = gallerySets
    .map((set) => {
      const images: GalleryImage[] = set.images
        .filter((image) => !image.name.toLowerCase().includes("before"))
        .map((image, index) => ({
          id: `${set.slug}-${image.id}`,
          src: image.src,
          title: formatTitle(image.name),
          description: buildDescription(set.name, index),
          beforeSrc: image.beforeSrc,
        }));

      return {
        ...set,
        images,
      };
    })
    .filter((set) => set.images.length > 0);

  const hasImages = preparedSets.length > 0;

  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.logoLink}>
          <Image
            src="/logo.png"
            alt="QuickHome AI"
            width={200}
            height={60}
            className={styles.logoImage}
            priority
          />
        </Link>
      </aside>

      <main className={styles.main}>
        {hasImages ? (
          <div className={styles.sections}>
            {preparedSets.map((set) => (
              <section key={set.slug} aria-labelledby={`${set.slug}-heading`}>
                <div className={styles.sectionHeader}>
                  <h2 id={`${set.slug}-heading`} className={styles.sectionTitle}>
                    {set.name}
                  </h2>
                  <p className={styles.sectionMeta}>
                    {set.images.length} {set.images.length === 1 ? "image" : "images"}
                  </p>
                </div>
                <GalleryGrid images={set.images} />
              </section>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>No gallery images found. Add after images to subfolders in <code>/public/input</code>.</p>
            <p>
              <Link href="/" prefetch={false}>
                Return Home
              </Link>
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
