import { getHomeGalleryMedia } from "@/lib/content";
import { PLACEHOLDER_GALLERY } from "@/lib/home-fallbacks";
import { GalleryCarousel } from "@/components/sections/GalleryCarousel";

export async function GalleryCarouselSection() {
  const fromDb = await getHomeGalleryMedia();
  const isPreview = fromDb.length === 0;
  const items = isPreview ? PLACEHOLDER_GALLERY : fromDb;

  return <GalleryCarousel items={items} isPreview={isPreview} />;
}
