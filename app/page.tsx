import { Suspense } from "react";
import { Hero } from "@/components/home/hero";
import { Library, LibraryView } from "@/components/home/library";
import { WaitlistGrid } from "@/components/home/waitlist";
import { WaitlistForm } from "@/components/home/waitlist-form";
import { countLabel, toCard } from "@/lib/content/card";
import { getEntries } from "@/lib/content";
import { waitlistMode } from "@/lib/site";

export const ensureStatic = "navigation";

export default function Home() {
  const cards = getEntries().map(toCard);

  if (waitlistMode) {
    return (
      <>
        <Hero meta={`opening with ${cards.length} ${cards.length === 1 ? "entry" : "entries"} · free · cc by`}>
          <WaitlistForm />
        </Hero>
        <WaitlistGrid cards={cards} />
      </>
    );
  }

  return (
    <>
      <Hero meta={`${countLabel(cards)} · free · cc by`} />
      {/* static HTML carries the unfiltered library; the URL's filters apply on hydration */}
      <Suspense fallback={<LibraryView cards={cards} type="all" tool={null} />}>
        <Library cards={cards} />
      </Suspense>
    </>
  );
}
