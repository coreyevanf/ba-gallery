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
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Main Image Container */}
      <div className="w-full relative">
        <div className="rounded-2xl overflow-hidden bg-white shadow-lg ring-1 ring-neutral-200 aspect-[4/3] lg:aspect-[16/9] max-h-[75vh]">
          <BeforeAfter
            before={pairs[currentIndex].beforeSrc}
            after={pairs[currentIndex].afterSrc}
            alt={`Interior ${pairs[currentIndex].id}`}
            position={50}
          />
        </div>

        {/* Navigation Arrows - Positioned on sides of image */}
        {pairs.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-neutral-50 text-neutral-800 rounded-full w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center shadow-lg ring-1 ring-neutral-200 hover:ring-neutral-300 transition-all hover:scale-105 z-10"
              aria-label="Previous"
            >
              <svg className="w-6 h-6 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-neutral-50 text-neutral-800 rounded-full w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center shadow-lg ring-1 ring-neutral-200 hover:ring-neutral-300 transition-all hover:scale-105 z-10"
              aria-label="Next"
            >
              <svg className="w-6 h-6 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Image Caption */}
      <div className="text-center">
        <p className="text-sm text-neutral-600">
          Interior {pairs[currentIndex].id} — Before/After comparison
        </p>
      </div>

      {/* Pagination Dots */}
      {pairs.length > 1 && (
        <div className="flex items-center gap-3 py-4">
          {pairs.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all rounded-full ${
                index === currentIndex
                  ? "bg-neutral-800 w-10 h-3"
                  : "bg-neutral-300 hover:bg-neutral-400 w-3 h-3"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Bottom Navigation Buttons */}
      {pairs.length > 1 && (
        <div className="flex items-center gap-4">
          <button
            onClick={goToPrevious}
            className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          
          <div className="text-sm text-neutral-600 font-medium min-w-[80px] text-center">
            {currentIndex + 1} of {pairs.length}
          </div>
          
          <button
            onClick={goToNext}
            className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            Next
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}