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
        <p className="text-white/60">
          Drop image pairs in{" "}
          <code className="bg-white/10 px-2 py-1 rounded font-mono text-sm text-white/80">
            /public/input
          </code>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Main Image Container - Centered */}
      <div className="w-full flex items-center justify-center">
        <div className="w-full max-w-5xl aspect-[16/9] max-h-[80vh] rounded-xl overflow-hidden">
          <BeforeAfter
            before={pairs[currentIndex].beforeSrc}
            after={pairs[currentIndex].afterSrc}
            alt={`Interior ${pairs[currentIndex].id}`}
            position={50}
          />
        </div>
      </div>

      {/* Title Below Image - Left Aligned */}
      <div className="w-full max-w-5xl">
        <h1 className="text-2xl md:text-3xl text-white font-normal">
          Before / After{" "}
          {pairs.length > 1 && (
            <span className="text-white/40 text-lg">({currentIndex + 1}/{pairs.length})</span>
          )}
        </h1>
      </div>

      {/* Thumbnail Gallery */}
      {pairs.length > 1 && (
        <div className="w-full max-w-5xl">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {pairs.map((pair, index) => (
              <button
                key={pair.id}
                onClick={() => setCurrentIndex(index)}
                className={`relative flex-shrink-0 w-20 h-14 md:w-24 md:h-16 rounded-lg overflow-hidden transition-all ${
                  index === currentIndex
                    ? "ring-2 ring-white scale-105"
                    : "opacity-50 hover:opacity-100 hover:scale-105"
                }`}
              >
                <div className="w-full h-full bg-black">
                  <img
                    src={pair.beforeSrc}
                    alt={`Thumbnail ${pair.id}`}
                    className="w-full h-full object-cover"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                </div>
                {index === currentIndex && (
                  <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] pointer-events-none"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Modern Navigation Buttons */}
      {pairs.length > 1 && (
        <div className="flex items-center gap-3">
          <button
            onClick={goToPrevious}
            className="group relative px-8 py-3 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 text-white rounded-full transition-all duration-300 border border-white/10 hover:border-white/20 hover:scale-105"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </span>
          </button>
          
          <button
            onClick={goToNext}
            className="group relative px-8 py-3 bg-gradient-to-r from-white to-white/90 hover:from-white hover:to-white text-black rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span className="flex items-center gap-2 font-medium">
              Next
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}