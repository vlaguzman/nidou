import Image from "next/image";
import { gallery } from "@/data/gallery";
import { sectionIds } from "@/data/site";
import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./Reveal";

export function GallerySection() {
  return (
    <section id={sectionIds.comunidad} className="bg-background py-18 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <Eyebrow>{gallery.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-balance font-heading text-3xl leading-tight text-foreground sm:text-5xl">
              {gallery.heading}
            </h2>
            <p className="mt-6 max-w-md text-pretty text-lg leading-relaxed text-foreground/75">
              {gallery.description}
            </p>
          </Reveal>

          <Reveal delay={150}>
            <div className="grid auto-rows-[140px] grid-cols-3 gap-3 sm:auto-rows-[180px] sm:gap-4">
              {gallery.photos.map((photo) => (
                <div
                  key={photo.src}
                  className={`group relative overflow-hidden rounded-2xl bg-muted ${
                    photo.layout === "tall" ? "row-span-2" : ""
                  }`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 768px) 33vw, 22vw"
                    className="object-cover transition-transform duration-1200 ease-out group-hover:scale-105 motion-reduce:transition-none"
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
