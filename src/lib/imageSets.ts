import fs from "node:fs/promises";
import path from "node:path";

export type Pair = {
  id: string;
  beforeSrc: string;
  afterSrc: string;
};

export type ImageSet = {
  name: string;
  slug: string;
  pairs: Pair[];
};

export type GalleryImage = {
  id: string;
  src: string;
  name: string;
  beforeSrc?: string;
};

export type GallerySet = {
  name: string;
  slug: string;
  images: GalleryImage[];
};

const exts = ["jpg", "jpeg", "png", "webp", "avif"];
const beforeRe = new RegExp(
  `^(?<category>[a-z0-9_-]+)_(?<index>\\d+)_before\\.(${exts.join("|")})$`,
  "i"
);
const afterRe = new RegExp(
  `^(?<category>[a-z0-9_-]+)_(?<index>\\d+)_after\\.(${exts.join("|")})$`,
  "i"
);

export async function getImageSets(): Promise<ImageSet[]> {
  const inputDir = path.join(process.cwd(), "public", "input");
  const sets: ImageSet[] = [];

  try {
    const entries = await fs.readdir(inputDir, { withFileTypes: true });

    const rootFiles = entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
    if (rootFiles.length > 0) {
      const rootPairs = await getPairsFromFiles(rootFiles, "/input");
      if (rootPairs.length > 0) {
        sets.push({ name: "Main Gallery", slug: "main", pairs: rootPairs });
      }
    }

    const subfolders = entries.filter(
      (entry) => entry.isDirectory() && !entry.name.startsWith(".")
    );

    for (const folder of subfolders) {
      const folderPath = path.join(inputDir, folder.name);
      const folderFiles = await fs.readdir(folderPath);
      const pairs = await getPairsFromFiles(
        folderFiles,
        `/input/${encodeURIComponent(folder.name)}`
      );
      if (pairs.length > 0) {
        sets.push({
          name: folder.name,
          slug: folder.name.toLowerCase().replace(/\s+/g, "-"),
          pairs,
        });
      }
    }
  } catch {
    return [];
  }

  return sets;
}

export async function getGallerySets(): Promise<GallerySet[]> {
  const inputDir = path.join(process.cwd(), "public", "input");
  const sets: GallerySet[] = [];

  try {
    const entries = await fs.readdir(inputDir, { withFileTypes: true });

    const subfolders = entries.filter(
      (entry) => entry.isDirectory() && !entry.name.startsWith(".")
    );

    for (const folder of subfolders) {
      const folderPath = path.join(inputDir, folder.name);
      const folderFiles = await fs.readdir(folderPath);
      
      const imageFiles = folderFiles.filter((file) => {
        const ext = file.split(".").pop()?.toLowerCase();
        const hasValidExt = ext && exts.includes(ext);
        const containsBefore = file.toLowerCase().includes("before");
        return hasValidExt && !containsBefore;
      });

      if (imageFiles.length > 0) {
        const images = imageFiles.map((file, index) => ({
          id: `${folder.name}-${index}`,
          src: `/input/${encodeURIComponent(folder.name)}/${encodeURIComponent(file)}`,
          name: file,
          beforeSrc: findMatchingBeforeSrc(folder.name, file, folderFiles),
        }));

        sets.push({
          name: folder.name,
          slug: folder.name.toLowerCase().replace(/\s+/g, "-"),
          images,
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
      record.beforeSrc = `${basePath}/${encodeURIComponent(fileName)}`;
      records.set(key, record);
      continue;
    }

    const afterMatch = fileName.match(afterRe);
    if (afterMatch?.groups) {
      const category = afterMatch.groups.category.toLowerCase();
      const index = Number(afterMatch.groups.index);
      const key = `${category}#${index}`;
      const record = records.get(key) ?? { category, index };
      record.afterSrc = `${basePath}/${encodeURIComponent(fileName)}`;
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

function findMatchingBeforeSrc(folderName: string, afterFile: string, allFiles: string[]): string | undefined {
  const candidates = buildBeforeCandidates(afterFile);
  const match = candidates
    .map((candidate) =>
      allFiles.find((file) => file.toLowerCase() === candidate.toLowerCase())
    )
    .find((resolved) => resolved !== undefined);

  if (!match) return undefined;

  return `/input/${encodeURIComponent(folderName)}/${encodeURIComponent(match)}`;
}

function buildBeforeCandidates(afterFile: string): string[] {
  const extensionMatch = afterFile.match(/\.([^.]+)$/);
  const extension = extensionMatch ? `.${extensionMatch[1]}` : "";
  const filenameWithoutExt = extension ? afterFile.slice(0, -extension.length) : afterFile;
  const candidates = new Set<string>();

  const replacements = [
    { search: /_after$/i, replace: "_before" },
    { search: /-after$/i, replace: "-before" },
    { search: / after$/i, replace: " before" },
    { search: /after$/i, replace: "before" },
  ];

  replacements.forEach(({ search, replace }) => {
    if (search.test(filenameWithoutExt)) {
      candidates.add(filenameWithoutExt.replace(search, replace) + extension);
    }
  });

  return Array.from(candidates);
}
