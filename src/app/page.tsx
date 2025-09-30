import fs from "node:fs/promises";
import path from "node:path";
import GalleryViewer from "@/components/GalleryViewer";

type Pair = { id: number; beforeSrc: string; afterSrc: string };

const exts = ["jpg", "jpeg", "png", "webp", "avif"];
const beforeRe = new RegExp(`^interior_(\\d+)_before\\.(${exts.join("|")})$`, "i");
const afterRe = new RegExp(`^interior_(\\d+)_after\\.(${exts.join("|")})$`, "i");

async function getPairs(): Promise<Pair[]> {
  const dir = path.join(process.cwd(), "public", "input");
  let files: string[] = [];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }

  const beforeMap = new Map<number, string>();
  const afterMap = new Map<number, string>();

  for (const f of files) {
    const mB = f.match(beforeRe);
    if (mB) {
      beforeMap.set(Number(mB[1]), `/input/${f}`);
      continue;
    }
    const mA = f.match(afterRe);
    if (mA) {
      afterMap.set(Number(mA[1]), `/input/${f}`);
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
  const pairs = await getPairs();

  return (
    <main className="min-h-screen bg-neutral-50">
      <header className="max-w-6xl mx-auto px-6 md:px-10 py-6">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Before / After{" "}
          {pairs.length > 0 && (
            <span className="ml-2 text-sm text-neutral-500 font-normal">({pairs.length})</span>
          )}
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Drag to compare. Left = Before, Right = After.
        </p>
      </header>
      <section className="max-w-6xl mx-auto px-6 md:px-10 pb-12">
        <GalleryViewer pairs={pairs} />
      </section>
    </main>
  );
}