import fs from "node:fs/promises";
import path from "node:path";
import BeforeAfter from "@/components/BeforeAfter";

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
      <section className="max-w-7xl mx-auto p-6 md:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 mb-4">
          Before / After {pairs.length > 0 && `(${pairs.length})`}
        </h1>

        {pairs.length === 0 ? (
          <p className="text-neutral-600">
            Drop image pairs in <code className="bg-neutral-200 px-1.5 py-0.5 rounded text-sm">/public/input</code> as{" "}
            <code className="bg-neutral-200 px-1.5 py-0.5 rounded text-sm">interior_&lt;n&gt;_before.&lt;ext&gt;</code> and{" "}
            <code className="bg-neutral-200 px-1.5 py-0.5 rounded text-sm">interior_&lt;n&gt;_after.&lt;ext&gt;</code>.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 auto-rows-[minmax(340px,auto)]">
            {pairs.map(({ id, beforeSrc, afterSrc }) => (
              <div key={id} className="h-[340px] md:h-[420px] lg:h-[520px]">
                <BeforeAfter
                  before={beforeSrc}
                  after={afterSrc}
                  alt={`Interior ${id}`}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}