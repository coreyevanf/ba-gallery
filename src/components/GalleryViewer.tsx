"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { ImageSet } from "@/lib/imageSets";

export default function GalleryViewer({ imageSets }: { imageSets: ImageSet[] }) {
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<{ src: string; id: string; index: number } | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentSet = imageSets[currentSetIndex];
  const pairs = useMemo(() => currentSet?.pairs ?? [], [currentSet]);

  const switchSet = (index: number) => {
    if (index === currentSetIndex) return;
    setIsTransitioning(true);
    setSelectedImage(null);
    setTimeout(() => {
      setCurrentSetIndex(index);
      setIsTransitioning(false);
    }, 200);
  };

  const goToNext = useCallback(() => {
    setSelectedImage((current) => {
      if (!current) return current;
      const nextIndex = current.index + 1;
      const nextPair = pairs[nextIndex];
      if (!nextPair) return current;
      return { src: nextPair.afterSrc, id: nextPair.id, index: nextIndex };
    });
  }, [pairs]);

  const goToPrevious = useCallback(() => {
    setSelectedImage((current) => {
      if (!current) return current;
      const prevIndex = current.index - 1;
      const prevPair = pairs[prevIndex];
      if (!prevPair) return current;
      return { src: prevPair.afterSrc, id: prevPair.id, index: prevIndex };
    });
  }, [pairs]);

  const handleThumbnailClick = useCallback(
    (index: number) => {
      const pair = pairs[index];
      if (!pair) return;
      setSelectedImage({ src: pair.afterSrc, id: pair.id, index });
    },
    [pairs]
  );

  // Keyboard navigation
  useEffect(() => {
    if (!selectedImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrevious();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, goToNext, goToPrevious]);

  const formatPairLabel = (value: string) =>
    value
      .split(/[-_]/)
      .filter(Boolean)
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(" ") || "Image";

  if (imageSets.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-gray-300 bg-white/60 px-6 py-16 text-center">
        <p className="text-gray-500">
          Drop image pairs into <code className="rounded bg-gray-100 px-2 py-1 font-mono text-sm text-gray-700">/public/input</code> to populate the gallery.
        </p>
      </div>
    );
  }

  if (pairs.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-gray-300 bg-white/60 px-6 py-16 text-center">
        <p className="text-gray-500">No images found in this gallery set yet.</p>
      </div>
    );
  }

  return (
    <>
      {/* Full-Size Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 z-10 rounded-full bg-black/50 backdrop-blur-sm p-2.5 text-white transition hover:bg-black/70 hover:scale-110"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image Counter */}
          <div className="absolute top-6 left-6 z-10 rounded-full bg-black/50 backdrop-blur-sm px-4 py-2 text-sm text-white">
            {selectedImage.index + 1} / {pairs.length}
          </div>

          {/* Centered Image Container */}
          <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
            <div className="relative flex items-center justify-center max-w-full max-h-full">
              {/* Previous Button */}
              {selectedImage.index > 0 && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                  className="absolute -left-16 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/50 backdrop-blur-sm p-3 text-white transition hover:bg-black/70 hover:scale-110 hidden md:flex"
                  aria-label="Previous"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {/* Image */}
              <img
                src={selectedImage.src}
                alt={selectedImage.id}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Next Button */}
              {selectedImage.index < pairs.length - 1 && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); goToNext(); }}
                  className="absolute -right-16 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/50 backdrop-blur-sm p-3 text-white transition hover:bg-black/70 hover:scale-110 hidden md:flex"
                  aria-label="Next"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation Buttons */}
          <div className="md:hidden absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-10">
            {selectedImage.index > 0 && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                className="rounded-full bg-black/50 backdrop-blur-sm p-3 text-white transition hover:bg-black/70"
                aria-label="Previous"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            {selectedImage.index < pairs.length - 1 && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="rounded-full bg-black/50 backdrop-blur-sm p-3 text-white transition hover:bg-black/70"
                aria-label="Next"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      <div className="space-y-10">
        {/* Gallery Navigation */}
        {imageSets.length > 1 && (
          <div className="sticky top-4 z-10">
            <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-3 rounded-full border border-gray-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
              {imageSets.map((set, index) => {
                const isActive = index === currentSetIndex;
                return (
                  <button
                    type="button"
                    key={set.slug}
                    onClick={() => switchSet(index)}
                    className={`group flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                      isActive
                        ? "bg-gray-900 text-white shadow"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    aria-pressed={isActive}
                    aria-label={`Switch to ${set.name}`}
                  >
                    <span>{set.name}</span>
                    <span className="rounded-full bg-gray-900/10 px-2 py-[0.15rem] text-[0.65rem] font-medium text-gray-700 transition group-hover:bg-gray-900/20 group-hover:text-gray-900">
                      {set.pairs.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className={`transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
          <div className="space-y-6">
            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-semibold text-gray-900">
                {currentSet.name}
              </h2>
              <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
                {pairs.length} {pairs.length === 1 ? "Image" : "Images"}
              </p>
            </div>

            <div className="grid grid-flow-dense gap-4 [grid-auto-rows:13.5rem] [grid-template-columns:repeat(auto-fit,minmax(15rem,1fr))] sm:[grid-auto-rows:16rem] lg:[grid-auto-rows:18rem]">
              {pairs.map((pair, index) => {
                const spanClass = index === 0
                  ? "lg:row-span-2 lg:col-span-2"
                  : index % 4 === 0
                    ? "lg:row-span-2"
                    : index % 4 === 1
                      ? "lg:col-span-2"
                      : "";

                return (
                  <button
                    type="button"
                    key={pair.id}
                    onClick={() => handleThumbnailClick(index)}
                    className={`group relative isolate flex h-full w-full cursor-pointer overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-200 transition duration-300 hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 ${spanClass}`}
                  >
                    <img
                      src={pair.afterSrc}
                      alt={pair.id}
                      className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
                      loading="lazy"
                    />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden flex-col gap-1 px-5 pb-5 md:flex">
                      <span className="text-[0.6rem] font-semibold uppercase tracking-[0.4em] text-white/60">
                        {currentSet.name}
                      </span>
                      <span className="text-base font-medium text-white">
                        {formatPairLabel(pair.id)}
                      </span>
                      <span className="text-xs text-white/70">
                        AI-enhanced transformation #{index + 1}
                      </span>
                    </div>

                    <div className="pointer-events-none absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-xs font-semibold text-gray-700 shadow-sm">
                      {index + 1}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
