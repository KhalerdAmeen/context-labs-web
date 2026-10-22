import { expect, test, type Page } from "@playwright/test";

// Phones: nothing wider than the screen, and every form field ≥ 16px (iOS Safari zooms the page when
// a focused field is smaller). The waitlist form and the download pop-up stack field + button.

const WIDTHS = [320, 375, 390, 430];
const PAGES = ["/", "/kits/context-labs", "/skills/setup", "/about", "/submit"];
const WAITLIST = "http://localhost:3301";

/** Fails with the elements that stick out, not just "scrollWidth was 412". */
async function expectFits(page: Page) {
  const r = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const clipped = (el: Element) => {
      for (let p = el.parentElement; p; p = p.parentElement) if (getComputedStyle(p).overflowX !== "visible") return true;
      return false;
    };
    const out = [...document.querySelectorAll("body *")]
      .filter((el) => {
        const b = el.getBoundingClientRect();
        return b.width > 0 && (b.right > vw + 0.5 || b.left < -0.5) && !clipped(el);
      })
      .map((el) => `${el.tagName.toLowerCase()}.${String(el.getAttribute("class") ?? "").split(" ").slice(0, 3).join(".")}`);
    const dialog = document.querySelector("dialog[open]");
    return {
      page: document.documentElement.scrollWidth - vw,
      dialog: dialog ? dialog.scrollWidth - dialog.clientWidth : 0,
      out: out.slice(0, 5),
    };
  });
  expect(r, `sticks out: ${r.out.join(", ")}`).toEqual({ page: 0, dialog: 0, out: [] });
}

async function expectFieldsReadable(page: Page) {
  const sizes = await page.locator("input, select, textarea").evaluateAll((els) =>
    els.map((el) => ({ name: (el as HTMLInputElement).name, px: parseFloat(getComputedStyle(el).fontSize) })),
  );
  for (const s of sizes) expect(s.px, `${s.name} font-size`).toBeGreaterThanOrEqual(16);
}

/** Field and button: both full width (same width), button below the field, field ≥ 48px tall. */
async function expectStacked(page: Page, field: string, button: string, scope = page.locator("body")) {
  const f = (await scope.getByLabel(field).boundingBox())!;
  const b = (await scope.getByRole("button", { name: button }).boundingBox())!;
  expect(f.height).toBeGreaterThanOrEqual(48);
  expect(Math.abs(f.width - b.width)).toBeLessThanOrEqual(1);
  expect(b.y).toBeGreaterThanOrEqual(f.y + f.height);
}

async function openPopup(page: Page) {
  await page.locator("div.sticky").getByRole("button", { name: "download .zip" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
}

for (const width of WIDTHS) {
  test.describe(`${width}px`, () => {
    test.use({ viewport: { width, height: 800 } });

    for (const path of PAGES) {
      test(`${path} fits and its fields are ≥ 16px`, async ({ page }) => {
        await page.goto(path);
        await expectFits(page);
        await expectFieldsReadable(page);
        if (path.startsWith("/kits/") || path.startsWith("/skills/")) {
          await openPopup(page);
          await expectFits(page);
          await expectFieldsReadable(page);
        }
      });
    }

    test("waitlist home: fits; email and button stacked, full width", async ({ page }) => {
      await page.goto(WAITLIST + "/");
      await expectFits(page);
      await expectFieldsReadable(page);
      await expectStacked(page, "email", "get early access");
    });

    test("download pop-up: email and send stacked, full width", async ({ page }) => {
      await page.goto("/skills/setup");
      await openPopup(page);
      await expectStacked(page, "email", "send the link", page.getByRole("dialog"));
    });

    test("menu overlay fits", async ({ page }) => {
      await page.goto("/");
      await page.getByRole("button", { name: "menu", exact: true }).click();
      await expect(page.locator("dialog[open]")).toBeVisible();
      await expectFits(page);
    });
  });
}
