"use client";

import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";

export default function BeforeAfter({
  before,
  after,
  alt,
  position = 50,
}: {
  before: string;
  after: string;
  alt?: string;
  position?: number;
}) {
  return (
    <div className="w-full h-full bg-neutral-900">
      <ReactCompareSlider
        itemOne={
          <ReactCompareSliderImage
            src={before}
            alt={alt ? `${alt} before` : "Before"}
            loading="lazy"
            decoding="async"
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        }
        itemTwo={
          <ReactCompareSliderImage
            src={after}
            alt={alt ? `${alt} after` : "After"}
            loading="lazy"
            decoding="async"
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        }
        position={position}
        boundsPadding={0}
        keyboardIncrement="5%"
        onlyHandleDraggable={false}
        handle={
          <div
            className="h-10 w-10 rounded-full bg-white/90 shadow-lg ring-2 ring-neutral-300 hover:scale-110 transition-transform cursor-ew-resize flex items-center justify-center"
            style={{
              position: "relative",
            }}
          >
            <div className="flex gap-1">
              <div className="w-0.5 h-4 bg-neutral-700"></div>
              <div className="w-0.5 h-4 bg-neutral-700"></div>
            </div>
          </div>
        }
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}