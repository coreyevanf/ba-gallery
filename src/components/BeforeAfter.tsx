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
    <div className="w-full h-full bg-black">
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
        position={position}
        boundsPadding={0}
        keyboardIncrement="5%"
        onlyHandleDraggable={false}
        handle={
          <div className="relative flex items-center justify-center h-full">
            {/* Vertical line */}
            <div className="absolute w-0.5 h-full bg-white/80 backdrop-blur-sm"></div>
            
            {/* Center handle with arrows */}
            <div className="relative bg-white/90 backdrop-blur-md rounded-full w-12 h-12 flex items-center justify-center shadow-2xl ring-2 ring-white/30 hover:scale-110 transition-transform cursor-ew-resize z-10">
              {/* Left arrow */}
              <svg className="w-4 h-4 text-black absolute left-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              
              {/* Right arrow */}
              <svg className="w-4 h-4 text-black absolute right-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        }
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}