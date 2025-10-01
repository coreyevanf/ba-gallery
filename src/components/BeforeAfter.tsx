"use client";

import {
  ReactCompareSlider,
  ReactCompareSliderHandle,
  ReactCompareSliderImage,
} from "react-compare-slider";

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
    <div className="w-full h-full bg-black flex items-center justify-center">
      <ReactCompareSlider
        itemOne={
          <ReactCompareSliderImage
            src={before}
            alt={alt ? `${alt} before` : "Before"}
            loading="lazy"
            decoding="async"
            style={{
              objectFit: "contain",
              objectPosition: "center",
              width: "100%",
              height: "100%",
            }}
          />
        }
        itemTwo={
          <ReactCompareSliderImage
            src={after}
            alt={alt ? `${alt} after` : "After"}
            loading="lazy"
            decoding="async"
            style={{
              objectFit: "contain",
              objectPosition: "center",
              width: "100%",
              height: "100%",
            }}
          />
        }
        position={position}
        boundsPadding={0}
        keyboardIncrement="5%"
        onlyHandleDraggable={false}
        handle={
          <ReactCompareSliderHandle
            linesStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              boxShadow: "0 0 6px rgba(0, 0, 0, 0.35)",
            }}
            buttonStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderColor: "rgba(0, 0, 0, 0.3)",
              color: "#111",
              width: 56,
              height: 56,
              boxShadow: "0 12px 32px rgba(0, 0, 0, 0.35)",
            }}
          />
        }
        style={{ width: "100%", height: "100%", maxWidth: "100%", margin: "0 auto" }}
      />
    </div>
  );
}
