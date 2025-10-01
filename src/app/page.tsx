import fs from "node:fs/promises";
import path from "node:path";
import GalleryViewer from "@/components/GalleryViewer";

type Pair = { id: string; beforeSrc: string; afterSrc: string };
type ImageSet = { name: string; slug: string; pairs: Pair[] };

const exts = ["jpg", "jpeg", "png", "webp", "avif"];
const beforeRe = new RegExp(
  `^(?<category>[a-z0-9_-]+)_(?<index>\\d+)_before\\.(${exts.join("|")})$`,
  "i"
);
const afterRe = new RegExp(
  `^(?<category>[a-z0-9_-]+)_(?<index>\\d+)_after\\.(${exts.join("|")})$`,
  "i"
);

async function getImageSets(): Promise<ImageSet[]> {
  const inputDir = path.join(process.cwd(), "public", "input");
  const sets: ImageSet[] = [];

  try {
    const entries = await fs.readdir(inputDir, { withFileTypes: true });
    
    // Check for images in root input folder
    const rootFiles = entries.filter(e => e.isFile()).map(e => e.name);
    if (rootFiles.length > 0) {
      const rootPairs = await getPairsFromFiles(rootFiles, "/input");
      if (rootPairs.length > 0) {
        sets.push({ name: "Main Gallery", slug: "main", pairs: rootPairs });
      }
    }

    // Check for images in subfolders
    const subfolders = entries.filter(e => e.isDirectory() && !e.name.startsWith('.'));
    for (const folder of subfolders) {
      const folderPath = path.join(inputDir, folder.name);
      const folderFiles = await fs.readdir(folderPath);
      const pairs = await getPairsFromFiles(folderFiles, `/input/${folder.name}`);
      if (pairs.length > 0) {
        sets.push({ 
          name: folder.name,
          slug: folder.name.toLowerCase().replace(/\s+/g, '-'),
          pairs 
        });
      }
    }
  } catch {
    return [];
  }

  return sets;
}

async function getPairsFromFiles(files: string[], basePath: string): Promise<Pair[]> {
  type Record = {
    category: string;
    index: number;
    beforeSrc?: string;
    afterSrc?: string;
  };

  const records = new Map<string, Record>();

  for (const fileName of files) {
    const beforeMatch = fileName.match(beforeRe);
    if (beforeMatch?.groups) {
      const category = beforeMatch.groups.category.toLowerCase();
      const index = Number(beforeMatch.groups.index);
      const key = `${category}#${index}`;
      const record = records.get(key) ?? { category, index };
      record.beforeSrc = `${basePath}/${fileName}`;
      records.set(key, record);
      continue;
    }

    const afterMatch = fileName.match(afterRe);
    if (afterMatch?.groups) {
      const category = afterMatch.groups.category.toLowerCase();
      const index = Number(afterMatch.groups.index);
      const key = `${category}#${index}`;
      const record = records.get(key) ?? { category, index };
      record.afterSrc = `${basePath}/${fileName}`;
      records.set(key, record);
    }
  }

  return Array.from(records.values())
    .filter((record) => record.beforeSrc && record.afterSrc)
    .sort((a, b) => {
      if (a.category === b.category) {
        return a.index - b.index;
      }
      return a.category.localeCompare(b.category);
    })
    .map(({ category, index, beforeSrc, afterSrc }) => ({
      id: `${category}-${index}`,
      beforeSrc: beforeSrc!,
      afterSrc: afterSrc!,
    }));
}

export default async function Page() {
  const imageSets = await getImageSets();

  return (
    <main className="min-h-screen bg-black">
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-8">
        <GalleryViewer imageSets={imageSets} />
      </section>
    </main>
  );
}
