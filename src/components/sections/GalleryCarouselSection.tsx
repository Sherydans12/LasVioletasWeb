import { getHomeGalleryMedia } from "@/lib/content";
import { GalleryCarousel } from "@/components/sections/GalleryCarousel";

export async function GalleryCarouselSection() {
  const items = await getHomeGalleryMedia();
  return <GalleryCarousel items={items} />;
}
