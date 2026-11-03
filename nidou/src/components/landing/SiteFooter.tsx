import { Mail } from "lucide-react";
import Image from "next/image";
import { footer } from "@/data/site";

const iconLink =
  "flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Image src="/nidou-logo.png" alt="NIDOU" width={140} height={44} className="h-10 w-auto" />
            <p className="mt-4 max-w-xs text-pretty leading-relaxed text-muted-foreground">
              {footer.tagline}
            </p>
          </div>

          {footer.columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-medium text-foreground">{column.title}</h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} NIDOU. {footer.closing}
          </p>
          <div className="flex items-center gap-4">
            <a href={`mailto:${footer.email}`} aria-label="Escríbenos un correo" className={iconLink}>
              <Mail className="h-4 w-4" aria-hidden />
            </a>
            <a href={footer.instagramHref} aria-label="Síguenos en Instagram" className={`${iconLink} text-sm`}>
              <span aria-hidden>IG</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
