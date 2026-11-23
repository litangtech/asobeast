import { expect, test } from "./session.mts";

test("changes the dashboard language without changing routes or app names", async ({
  page,
}) => {
  await page.goto("/settings");
  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();

  await page.getByRole("combobox", { name: "Language" }).click();
  await page.getByRole("option", { name: "简体中文" }).click();
  await expect(page).toHaveURL("/settings");
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page.getByRole("heading", { name: "设置" })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("combobox", { name: "语言" })).toContainText(
    "简体中文",
  );
  await page.getByRole("link", { name: "概览", exact: true }).click();
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("heading", { name: "概览" })).toBeVisible();
  await expect(
    page.getByText("Focus Timer", { exact: true }).first(),
  ).toBeVisible();

  await page.getByRole("link", { name: "设置", exact: true }).click();
  await page.getByRole("combobox", { name: "语言" }).click();
  await page.getByRole("option", { name: "English" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
});

test("uses English for an unsupported language preference", async ({
  page,
}) => {
  await page
    .context()
    .addCookies([
      { name: "asobeast_language", value: "fr", url: "http://localhost:3000" },
    ]);
  await page.goto("/settings");
  await expect(page.getByRole("combobox", { name: "Language" })).toContainText(
    "English",
  );
});
