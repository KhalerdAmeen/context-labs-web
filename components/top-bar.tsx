"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { activeNav, nav, site } from "@/lib/site";
import { ArrowUpRight, Burger, Close, Mark } from "./icons";

// design/CLTopBar.dc.html + the menu overlay in design/SystemStates.dc.html (state "menu").

const menuOrder = ["browse", "about", "submit"] as const;

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="flex min-h-11 items-center gap-2.5 text-18 font-medium tracking-heading">
      <Mark />
      <span>{site.name}</span>
    </Link>
  );
}

function Bar({ children, onLogo }: { children: React.ReactNode; onLogo?: () => void }) {
  return (
    <div className="flex h-16 items-center justify-between border-b border-hairline bg-bg pr-1.5 pl-5 t:pr-2.5 t:pl-6">
      <Logo onClick={onLogo} />
      {children}
    </div>
  );
}

export function TopBar() {
  const pathname = usePathname();
  const active = activeNav(pathname);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  const openMenu = () => {
    dialogRef.current?.showModal();
    setOpen(true);
  };
  const closeMenu = () => dialogRef.current?.close();

  // Widening past the mobile breakpoint leaves no menu button to close it with.
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 600px)");
    const onChange = () => wide.matches && dialogRef.current?.close();
    wide.addEventListener("change", onChange);
    return () => wide.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-20">
        <Bar>
          <nav aria-label="main" className="hidden items-center t:flex">
            {nav.map((l) => (
              <Link
                key={l.key}
                href={l.href}
                aria-current={active === l.key ? "page" : undefined}
                className={`flex h-11 items-center px-3.5 text-14 transition-colors hover:text-text ${active === l.key ? "text-text" : "text-muted"}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center t:hidden">
            <Link href="/submit" className="flex h-11 items-center px-3.5 text-14">
              submit
            </Link>
            <button
              type="button"
              onClick={openMenu}
              aria-label="menu"
              aria-haspopup="dialog"
              aria-expanded={open}
              className="flex size-11 cursor-pointer items-center justify-center"
            >
              <Burger />
            </button>
          </div>
        </Bar>
      </header>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        aria-label="menu"
        className="size-full bg-bg t:hidden"
      >
        {/* the dialog sits in the top layer, above the page grain, so it carries its own */}
        <div aria-hidden="true" className="grain pointer-events-none fixed inset-0 z-50" />
        <div className="flex min-h-full flex-col px-4">
          <div className="flex flex-1 flex-col border-x border-hairline">
            <Bar onLogo={closeMenu}>
              <button
                type="button"
                onClick={closeMenu}
                aria-label="close menu"
                className="flex size-11 cursor-pointer items-center justify-center"
                autoFocus
              >
                <Close />
              </button>
            </Bar>
            <nav aria-label="menu" className="flex flex-1 flex-col">
              {menuOrder.map((key) => nav.find((l) => l.key === key)!).map((l) => (
                <Link
                  key={l.key}
                  href={l.href}
                  onClick={closeMenu}
                  aria-current={active === l.key ? "page" : undefined}
                  className="focus-inset flex min-h-18 items-center justify-between border-b border-hairline px-5 text-22 font-medium tracking-heading"
                >
                  {l.label}
                </Link>
              ))}
              <a
                href={site.xUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-inset flex min-h-18 items-center justify-between border-b border-hairline px-5 text-22 font-medium tracking-heading"
              >
                <span>x</span>
                <ArrowUpRight className="text-muted" />
              </a>
              <p className="label mt-auto px-5 pt-5 pb-7 leading-meta text-muted">
                {site.name} · made by {site.author} · {site.licence}
              </p>
            </nav>
          </div>
        </div>
      </dialog>
    </>
  );
}
