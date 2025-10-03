"use client";

import { useState, useEffect, useCallback } from "react";
import BeforeAfter from "@/components/BeforeAfter";
import styles from "./gallery.module.css";

export type GalleryImage = {
  id: string;
  src: string;
  title: string;
  description: string;
  beforeSrc?: string;
};

type Props = {
  images: GalleryImage[];
};

export default function GalleryGrid({ images }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const hasImages = images.length > 0;

  const openModal = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const closeModal = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const goToNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) return current;
      return current + 1 >= images.length ? 0 : current + 1;
    });
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) return current;
      return current - 1 < 0 ? images.length - 1 : current - 1;
    });
  }, [images.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
      if (event.key === "ArrowRight") {
        goToNext();
      }
      if (event.key === "ArrowLeft") {
        goToPrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, closeModal, goToNext, goToPrevious]);

  useEffect(() => {
    if (activeIndex === null) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [activeIndex]);

  const activeImage = activeIndex !== null ? images[activeIndex] : null;

  return (
    <>
      <div className={styles.gallery}>
        {hasImages &&
          images.map((image, index) => (
            <figure
              key={image.id}
              className={styles.figure}
              role="button"
              tabIndex={0}
              onClick={() => openModal(index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openModal(index);
                }
              }}
            >
              <img src={image.src} alt={image.title} className={styles.image} loading="lazy" />
              <figcaption className={styles.caption}>
                <h3 className={styles.captionTitle}>{image.title}</h3>
                <p className={styles.captionText}>{image.description}</p>
              </figcaption>
            </figure>
          ))}
      </div>

      {activeImage && (
        <div
          className={styles.modal}
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.title}
          onClick={closeModal}
        >
          <div className={styles.modalBody} onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className={styles.modalClose}
              onClick={closeModal}
              aria-label="Close full-size image"
            >
              <svg className={styles.modalIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </button>

            <div className={styles.modalCounter}>
              {activeIndex + 1} / {images.length}
            </div>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  className={`${styles.modalNav} ${styles.modalNavLeft}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    goToPrevious();
                  }}
                  aria-label="View previous image"
                >
                  <svg className={styles.modalIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>

                <button
                  type="button"
                  className={`${styles.modalNav} ${styles.modalNavRight}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    goToNext();
                  }}
                  aria-label="View next image"
                >
                  <svg className={styles.modalIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              </>
            )}

            <div className={styles.modalImageWrapper}>
              {activeImage.beforeSrc ? (
                <BeforeAfter
                  before={activeImage.beforeSrc}
                  after={activeImage.src}
                  alt={activeImage.title}
                />
              ) : (
                <img src={activeImage.src} alt={activeImage.title} className={styles.modalImage} />
              )}
            </div>

            {images.length > 1 && (
              <div className={styles.modalMobileNav}>
                <button
                  type="button"
                  className={styles.modalMobileButton}
                  onClick={(event) => {
                    event.stopPropagation();
                    goToPrevious();
                  }}
                  aria-label="View previous image"
                >
                  <svg className={styles.modalIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={styles.modalMobileButton}
                  onClick={(event) => {
                    event.stopPropagation();
                    goToNext();
                  }}
                  aria-label="View next image"
                >
                  <svg className={styles.modalIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
