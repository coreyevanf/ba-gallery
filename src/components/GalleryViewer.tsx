"use client";

import { useState, useEffect } from "react";
import BeforeAfter from "./BeforeAfter";

type Pair = { id: string; beforeSrc: string; afterSrc: string };
type ImageSet = { name: string; slug: string; pairs: Pair[] };

export default function GalleryViewer({ imageSets }: { imageSets: ImageSet[] }) {
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const currentSet = imageSets[currentSetIndex];
  const pairs = currentSet?.pairs || [];

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % pairs.length);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + pairs.length) % pairs.length);
  };

  const switchSet = (index: number) => {
    setCurrentSetIndex(index);
    setCurrentImageIndex(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (pairs.length === 0) return;
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrevious();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pairs.length]);

  // Handle loading state when image changes
  useEffect(() => {
    if (pairs.length === 0) return;
    
    const currentPair = pairs[currentImageIndex];
    const beforeLoaded = loadedImages.has(currentPair.beforeSrc);
    const afterLoaded = loadedImages.has(currentPair.afterSrc);
    
    if (beforeLoaded && afterLoaded) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
      // Preload images
      const preloadImage = (src: string) => {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => new Set(prev).add(src));
        };
        img.src = src;
      };
      
      if (!beforeLoaded) preloadImage(currentPair.beforeSrc);
      if (!afterLoaded) preloadImage(currentPair.afterSrc);
    }
  }, [currentImageIndex, currentSetIndex, pairs, loadedImages]);

  if (imageSets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60">
          Drop image pairs in{" "}
          <code className="bg-white/10 px-2 py-1 rounded font-mono text-sm text-white/80">
            /public/input
          </code>{" "}
          or create subfolders for different galleries
        </p>
      </div>
    );
  }

  if (pairs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60">No image pairs found in this gallery.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Loading Spinner Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      )}
      
      {imageSets.length > 1 && (
        <div className="sticky top-6 z-30 mb-8">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-white/50 mb-6 pt-4">
            <span>Galleries</span>
            <div style={{ paddingBlock: "20px" }} aria-hidden />
            <span className="tracking-normal text-white/40">
              {currentSetIndex + 1}/{imageSets.length}
            </span>
            
          </div>
          <div className="flex gap-2 overflow-x-auto px-3 py-2 rounded-full bg-white/5 backdrop-blur">
            {imageSets.map((set, index) => {
              const isActive = index === currentSetIndex;
              return (
                <button
                  key={set.slug}
                  onClick={() => switchSet(index)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-white text-black shadow-sm"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {set.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

<div style={{ paddingBlock: "15px" }} aria-hidden />
      <div className="flex flex-col items-center gap-8 min-h-[75vh] justify-center py-8">
        <div className="w-full max-w-5xl">
          <div className="rounded-xl overflow-hidden shadow-2xl mx-auto" style={{ maxWidth: '90vw' }}>
            <div className="aspect-[16/9] bg-black flex items-center justify-center">
              <BeforeAfter
                before={pairs[currentImageIndex].beforeSrc}
                after={pairs[currentImageIndex].afterSrc}
                alt={`${currentSet.name} ${pairs[currentImageIndex].id}`}
                position={50}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4 pb-4">
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl text-white font-semibold">
                {currentSet.name}
              </h1>
              <p className="text-white/60 text-sm md:text-base">
                Before / After • Shot {currentImageIndex + 1} of {pairs.length}
              </p>
            </div>


          </div>

          {pairs.length > 1 && (
            <div className="lg:hidden">
              <div className="text-xs uppercase tracking-[0.25em] text-white/50 mb-3">Thumbnails</div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {pairs.map((pair, index) => (
                  <button
                    key={pair.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                      index === currentImageIndex
                        ? "ring-2 ring-white scale-105"
                        : "opacity-60 hover:opacity-100 hover:scale-105"
                    }`}
                    style={{ width: "96px", height: "64px" }}
                  >
                    <img
                      src={pair.beforeSrc}
                      alt={`Thumbnail ${pair.id}`}
                      className="h-full w-full object-cover"
                      width={96}
                      height={64}
                    />
                    {index === currentImageIndex && (
                      <div className="pointer-events-none absolute inset-0 bg-white/20 backdrop-blur-[1px]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {pairs.length > 1 && (
          <div className="hidden w-full max-w-5xl rounded-2xl bg-white/5 backdrop-blur-md px-5 py-6 lg:block">
            <div className="text-xs uppercase tracking-[0.25em] text-white/50 mb-4">Thumbnails</div>
            <div className="grid grid-cols-4 gap-4">
              {pairs.map((pair, index) => (
                <button
                  key={pair.id}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative rounded-xl overflow-hidden transition-all ${
                    index === currentImageIndex
                      ? "ring-2 ring-white"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={pair.beforeSrc}
                    alt={`Thumbnail ${pair.id}`}
                    className="h-full w-full object-cover"
                    width={140}
                    height={90}
                  />
                  {index === currentImageIndex && (
                    <div className="pointer-events-none absolute inset-0 bg-white/15 backdrop-blur-[1px]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
