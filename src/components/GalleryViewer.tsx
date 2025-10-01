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
        <p className="text-white/60 font-light">
          Drop image pairs in{" "}
          <code className="bg-white/10 px-2 py-1 rounded font-mono text-sm text-white/80">
            /public/input
          </code>{" "}
          as{" "}
          <code className="bg-white/10 px-2 py-1 rounded font-mono text-sm text-white/80">
            interior_&lt;n&gt;_before.&lt;ext&gt;
          </code>{" "}
          and{" "}
          <code className="bg-white/10 px-2 py-1 rounded font-mono text-sm text-white/80">
            interior_&lt;n&gt;_after.&lt;ext&gt;
          </code>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      {/* Main Image Container */}
      <div className="w-full relative">
        <div className="rounded-xl overflow-hidden bg-black border border-white/10 aspect-[4/3] lg:aspect-[16/9] max-h-[75vh] shadow-2xl">
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
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center border border-white/20 hover:border-white/40 transition-all hover:scale-110 z-10 group"
              aria-label="Previous"
            >
              <svg className="w-6 h-6 lg:w-7 lg:h-7 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center border border-white/20 hover:border-white/40 transition-all hover:scale-110 z-10 group"
              aria-label="Next"
            >
              <svg className="w-6 h-6 lg:w-7 lg:h-7 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Image Caption */}
      <div className="text-center">
        <p className="text-sm text-white/50 font-light">
          Interior {pairs[currentIndex].id}
        </p>
      </div>

      {/* Pagination Dots */}
      {pairs.length > 1 && (
        <div className="flex items-center gap-2.5 py-2">
          {pairs.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all rounded-full ${
                index === currentIndex
                  ? "bg-white w-10 h-2.5"
                  : "bg-white/30 hover:bg-white/50 w-2.5 h-2.5"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Bottom Navigation Buttons */}
      {pairs.length > 1 && (
        <div className="flex items-center gap-6">
          <button
            onClick={goToPrevious}
            className="group px-6 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-lg font-light transition-all flex items-center gap-2 border border-white/20 hover:border-white/40"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          
          <div className="text-sm text-white/60 font-light min-w-[70px] text-center">
            {currentIndex + 1} of {pairs.length}
          </div>
          
          <button
            onClick={goToNext}
            className="group px-6 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-lg font-light transition-all flex items-center gap-2 border border-white/20 hover:border-white/40"
          >
            Next
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}