import Link from "next/link";
import { site, submissionsLabel } from "@/lib/site";
import { ArrowUpRight } from "./icons";

// design/CLFooter.dc.html. Adds a privacy link (approved deviation, see the build plan).

const linkClass = "flex h-11 items-center gap-1.5 px-3.5 text-muted transition-colors hover:text-text";

export function Footer() {
  return (
    <footer className="label flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-hairline bg-bg py-3 pr-1.5 pl-5 text-muted t:pr-2.5 t:pl-6">
      <span className="py-3.5 leading-body">
        {site.name} · made by {site.author} · {submissionsLabel} · {site.licence}
      </span>
      <div className="-ml-3.5 flex items-center t:ml-0">
        <Link href="/submit" className={linkClass}>
          submit <ArrowUpRight size={9} strokeWidth={1.8} />
        </Link>
        <Link href="/privacy" className={linkClass}>
          privacy
        </Link>
        <a href={site.xUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
          x <ArrowUpRight size={9} strokeWidth={1.8} />
        </a>
      </div>
    </footer>
  );
}
