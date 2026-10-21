import { expect, test } from "@playwright/test";

test.describe("download pop-up", () => {
  test("is a labelled modal: focus inside, Tab stays inside, Esc closes and returns focus", async ({ page }) => {
    await page.goto("/skills/setup");
    const trigger = page.locator("aside").getByRole("button", { name: "download .zip" });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "where should we send it?" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel("email")).toBeFocused();
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("Tab");
      expect(await page.evaluate(() => !!document.activeElement?.closest("dialog[open]"))).toBe(true);
    }
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("sends with the opt-in, then remembers the email for next time", async ({ page }) => {
    await page.goto("/skills/setup");
    const trigger = page.locator("aside").getByRole("button", { name: "download .zip" });
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("email").fill("test@example.com");
    await expect(dialog.getByRole("checkbox", { name: /send me new kits/ })).toHaveAttribute("aria-checked", "false");
    await dialog.getByRole("checkbox", { name: /send me new kits/ }).click();
    const sent = page.waitForRequest("**/api/download");
    await dialog.getByRole("button", { name: "send the link" }).click();
    expect((await sent).postDataJSON()).toMatchObject({ slug: "setup", email: "test@example.com", optIn: true });
    await expect(dialog.getByText("check your inbox.")).toBeVisible();
    await dialog.getByRole("button", { name: "done" }).click();

    const again = page.waitForRequest("**/api/download");
    await trigger.click();
    expect((await again).postDataJSON()).toMatchObject({ email: "test@example.com", optIn: false });
    await expect(page.getByRole("dialog").getByLabel("email")).toHaveCount(0);
  });

  test("shows the server's error and keeps the typed email", async ({ page }) => {
    await page.route("**/api/download", (r) => r.fulfill({ status: 502, json: { error: "something went wrong. try again in a minute." } }));
    await page.goto("/kits/context-labs");
    await page.locator("aside").getByRole("button", { name: "download .zip" }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("email").fill("me@x.co");
    await dialog.getByRole("button", { name: "send the link" }).click();
    await expect(dialog.getByRole("alert")).toHaveText("something went wrong. try again in a minute.");
    await expect(dialog.getByLabel("email")).toHaveValue("me@x.co");
  });
});

test("install commands copy exactly", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/kits/context-labs");
  for (const cmd of ["/plugin marketplace add KhalerdAmeen/context-labs", "/plugin install context-labs@context-labs"]) {
    await page.getByRole("button", { name: `copy: ${cmd}` }).click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(cmd);
  }
});

test("zips are never served directly", async ({ request }) => {
  for (const path of ["/context-labs-kit.zip", "/content/kits/context-labs/files/context-labs-kit.zip", "/kits/context-labs/files/context-labs-kit.zip"]) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
});

test("filters live in the URL and an empty mix says so", async ({ page }) => {
  await page.goto("/?type=skill&tool=claude-app");
  await expect(page.locator("main h3")).toHaveText(["setup", "review"]);
  await page.getByRole("button", { name: "Kits" }).click();
  await page.getByRole("button", { name: "Claude app" }).click(); // toggles the tool off
  await expect(page).toHaveURL(/\?type=kit$/);
});

test("unknown drawers 404 with the drawer page", async ({ page }) => {
  const res = await page.goto("/kits/no-such-kit");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "drawer not found" })).toBeVisible();
});
