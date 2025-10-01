import fs from "node:fs/promises";
import path from "node:path";
import GalleryViewer from "@/components/GalleryViewer";

type Pair = { id: number; beforeSrc: string; afterSrc: string };
type ImageSet = { name: string; slug: string; pairs: Pair[] };

const exts = ["jpg", "jpeg", "png", "webp", "avif"];
const beforeRe = new RegExp(`^interior_(\\d+)_before\\.(${exts.join("|")})$`, "i");
const afterRe = new RegExp(`^interior_(\\d+)_after\\.(${exts.join("|")})$`, "i");

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
  const beforeMap = new Map<number, string>();
  const afterMap = new Map<number, string>();

  for (const f of files) {
    const mB = f.match(beforeRe);
    if (mB) {
      beforeMap.set(Number(mB[1]), `${basePath}/${f}`);
      continue;
    }
    const mA = f.match(afterRe);
    if (mA) {
      afterMap.set(Number(mA[1]), `${basePath}/${f}`);
    }
  }

  const ids = Array.from(new Set([...beforeMap.keys(), ...afterMap.keys()])).sort(
    (a, b) => a - b
  );

  const pairs: Pair[] = [];
  for (const id of ids) {
    const beforeSrc = beforeMap.get(id);
    const afterSrc = afterMap.get(id);
    if (beforeSrc && afterSrc) {
      pairs.push({ id, beforeSrc, afterSrc });
    }
  }
  return pairs;
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