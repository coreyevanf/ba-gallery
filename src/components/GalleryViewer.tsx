"use client";

import { useState } from "react";
import BeforeAfter from "./BeforeAfter";

type Pair = { id: number; beforeSrc: string; afterSrc: string };

export default function GalleryViewer({ pairs }: { pairs: Pair[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [swappedCards, setSwappedCards] = useState<Set<number>>(new Set());

  const toggleSwap = (id: number) => {
    setSwappedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const closeLightbox = () => setLightboxIndex(null);

  const goToNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % pairs.length);
    }
  };

  const goToPrevious = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + pairs.length) % pairs.length);
    }
  };

  if (pairs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600">
          Drop image pairs in{" "}
          <code className="bg-neutral-200 px-1.5 py-0.5 rounded text-sm font-mono">
            /public/input
          </code>{" "}
          as{" "}
          <code className="bg-neutral-200 px-1.5 py-0.5 rounded text-sm font-mono">
            interior_&lt;n&gt;_before.&lt;ext&gt;
          </code>{" "}
          and{" "}
          <code className="bg-neutral-200 px-1.5 py-0.5 rounded text-sm font-mono">
            interior_&lt;n&gt;_after.&lt;ext&gt;
          </code>
          .
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Grid Layout */}
      <div className="grid gap-6 md:grid-cols-2">
        {pairs.map(({ id, beforeSrc, afterSrc }) => {
          const isSwapped = swappedCards.has(id);
          return (
            <div key={id} className="space-y-3">
              {/* Card */}
              <div
                className="rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-neutral-200 cursor-pointer hover:shadow-md transition-shadow aspect-[3/2] md:aspect-[16/9] relative group"
                onClick={() => setLightboxIndex(pairs.findIndex((p) => p.id === id))}
              >
                <BeforeAfter
                  before={isSwapped ? afterSrc : beforeSrc}
                  after={isSwapped ? beforeSrc : afterSrc}
                  alt={`Interior ${id}`}
                  position={50}
                />
              </div>

              {/* Caption & Controls */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-600">
                  Interior {id} — Before/After comparison
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleSwap(id)}
                    className="text-xs px-2 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                    title={isSwapped ? "Restore original order" : "Swap before/after"}
                  >
                    {isSwapped ? "↺ Reset" : "⇄ Swap"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white text-4xl hover:text-neutral-300 transition-colors z-50 w-10 h-10 flex items-center justify-center"
            aria-label="Close"
          >
            ×
          </button>

          {pairs.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-5xl hover:text-neutral-300 transition-colors bg-black/30 hover:bg-black/50 rounded-full w-14 h-14 flex items-center justify-center"
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-5xl hover:text-neutral-300 transition-colors bg-black/30 hover:bg-black/50 rounded-full w-14 h-14 flex items-center justify-center"
                aria-label="Next"
              >
                ›
              </button>
            </>
          )}

          <div
            className="w-full h-full max-w-7xl max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full h-full rounded-lg overflow-hidden">
              <BeforeAfter
                before={pairs[lightboxIndex].beforeSrc}
                after={pairs[lightboxIndex].afterSrc}
                alt={`Interior ${pairs[lightboxIndex].id}`}
                position={50}
              />
            </div>
            <p className="text-white text-center mt-4 text-sm">
              {lightboxIndex + 1} / {pairs.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}