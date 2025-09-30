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
    <div className="rounded-2xl overflow-hidden shadow bg-white h-full">
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
        boundsPadding={0}
        keyboardIncrement="5%"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
