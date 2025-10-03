"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-3xl px-6 text-center space-y-10">
        <div className="space-y-3">
          <p className="text-sm tracking-wider font-medium text-white/50">Real Estate AI</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
            Preview Listing Photo Galleries
          </h1>
          <p className="text-white/60 text-base font-normal leading-relaxed">
            Choose how you want to explore the generated transformations below.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <button
            onClick={() => router.push("/sliders")}
            className="inline-flex items-center justify-center px-12 py-4 text-lg font-bold transition-all duration-200 active:scale-95"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: '2px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '16px',
              color: 'white',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
            }}
          >
            Sliders
          </button>
          <button
            onClick={() => router.push("/gallery")}
            className="inline-flex items-center justify-center px-12 py-4 text-lg font-bold transition-all duration-200 active:scale-95"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: '2px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '16px',
              color: 'white',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
            }}
          >
            Gallery
          </button>
        </div>
      </div>
    </main>
  );
}
