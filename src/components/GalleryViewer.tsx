"use client";

import { useState, useEffect } from "react";
import BeforeAfter from "./BeforeAfter";

type Pair = { id: number; beforeSrc: string; afterSrc: string };

export default function GalleryViewer({ pairs }: { pairs: Pair[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % pairs.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + pairs.length) % pairs.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrevious();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (pairs.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <p className="text-neutral-400 text-left">
          Drop image pairs in <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-sm">/public/input</code> as{" "}
          <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-sm">interior_&lt;n&gt;_before.&lt;ext&gt;</code> and{" "}
          <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-sm">interior_&lt;n&gt;_after.&lt;ext&gt;</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Main Carousel */}
      <div className="h-[85vh] md:h-[88vh] w-full relative">
        <BeforeAfter
          before={pairs[currentIndex].beforeSrc}
          after={pairs[currentIndex].afterSrc}
          alt={`Interior ${pairs[currentIndex].id}`}
        />

        {/* Navigation Arrows */}
        {pairs.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-5xl md:text-6xl hover:text-neutral-300 transition-colors z-10 bg-black/30 hover:bg-black/50 rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center"
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-5xl md:text-6xl hover:text-neutral-300 transition-colors z-10 bg-black/30 hover:bg-black/50 rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center"
              aria-label="Next"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Dot Navigation */}
      {pairs.length > 1 && (
        <div className="flex justify-center gap-2 mt-4 mb-2">
          {pairs.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-white w-8"
                  : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
