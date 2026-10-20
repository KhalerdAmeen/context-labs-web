import { site } from "@/lib/site";

// design/ContextLabsHome.dc.html hero: display 44/64/72, padding 48·40 / 72·48 / 88·56.
export function Hero({ meta, children }: { meta: string; children?: React.ReactNode }) {
  return (
    <section className="px-5 pt-12 pb-10 t:px-6 t:pt-18 t:pb-12 d:pt-22 d:pb-14">
      <h1 className="text-44 leading-display font-medium tracking-display text-balance t:text-64 d:text-72">
        the context behind good ai work.
      </h1>
      <p className="mt-5 max-w-52ch text-15 leading-body text-pretty text-muted">{site.description}</p>
      {children}
      <p className="label mt-6 text-muted">{meta}</p>
    </section>
  );
}
