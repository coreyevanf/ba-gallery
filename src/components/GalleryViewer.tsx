"use client";

import { useState } from "react";
import BeforeAfter from "./BeforeAfter";

type Pair = { id: number; beforeSrc: string; afterSrc: string };

export default function GalleryViewer({ pairs }: { pairs: Pair[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % pairs.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + pairs.length) % pairs.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") goToNext();
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "Escape") setIsFullscreen(false);
  };

  if (pairs.length === 0) {
    return (
      <p className="text-neutral-400 text-center">
        Drop image pairs in <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-sm">/public/input</code> as{" "}
        <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-sm">interior_&lt;n&gt;_before.&lt;ext&gt;</code> and{" "}
        <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-sm">interior_&lt;n&gt;_after.&lt;ext&gt;</code>.
      </p>
    );
  }

  return (
    <>
      {/* Grid View */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 auto-rows-[minmax(340px,auto)]">
        {pairs.map(({ id, beforeSrc, afterSrc }, index) => (
          <div
            key={id}
            className="h-[340px] md:h-[420px] lg:h-[520px] cursor-pointer"
            onClick={() => {
              setCurrentIndex(index);
              setIsFullscreen(true);
            }}
          >
            <BeforeAfter before={beforeSrc} after={afterSrc} alt={`Interior ${id}`} />
          </div>
        ))}
      </div>

      {/* Fullscreen Viewer */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 text-white text-4xl hover:text-neutral-400 z-50"
            aria-label="Close"
          >
            ×
          </button>

          <button
            onClick={goToPrevious}
            className="absolute left-4 text-white text-6xl hover:text-neutral-400 z-50"
            aria-label="Previous"
          >
            ‹
          </button>

          <div className="w-full h-full p-12 flex flex-col items-center justify-center">
            <div className="w-full h-full max-w-7xl">
              <BeforeAfter
                before={pairs[currentIndex].beforeSrc}
                after={pairs[currentIndex].afterSrc}
                alt={`Interior ${pairs[currentIndex].id}`}
              />
            </div>
            <p className="text-white mt-4 text-sm" style={{ fontFamily: 'Georgia, serif' }}>
              {currentIndex + 1} / {pairs.length}
            </p>
          </div>

          <button
            onClick={goToNext}
            className="absolute right-4 text-white text-6xl hover:text-neutral-400 z-50"
            aria-label="Next"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
