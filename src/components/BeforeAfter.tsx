"use client";

import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";

export default function BeforeAfter({
  before,
  after,
  alt,
}: {
  before: string;
  after: string;
  alt?: string;
}) {
  return (
    <div className="rounded-lg overflow-hidden shadow-xl bg-black h-full flex items-center justify-center">
      <ReactCompareSlider
        itemOne={
          <ReactCompareSliderImage
            src={before}
            alt={alt ? `${alt} before` : "Before"}
            loading="lazy"
            decoding="async"
            style={{ objectFit: "contain", width: "100%", height: "100%" }}
          />
        }
        itemTwo={
          <ReactCompareSliderImage
            src={after}
            alt={alt ? `${alt} after` : "After"}
            loading="lazy"
            decoding="async"
            style={{ objectFit: "contain", width: "100%", height: "100%" }}
          />
        }
        boundsPadding={0}
        keyboardIncrement="5%"
        style={{ width: "100%", height: "100%", backgroundColor: "black" }}
      />
    </div>
  );
}
