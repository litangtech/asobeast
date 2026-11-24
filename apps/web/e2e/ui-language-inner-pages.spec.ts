import { expect, test } from "./session.mts";
import { startedSetup } from "./setup-session.mts";

const routes = [
  "/",
  "/settings",
  "/actions",
  "/alerts",
  "/charts",
  "/integrations",
  "/integrations/google-play?error=access_denied",
  "/whats-new",
  ...[
    "",
    "/setup",
    "/actions",
    "/audit",
    "/changes",
    "/competitors",
    "/keywords",
    "/metadata",
    "/rankings",
    "/reviews",
  ].map((path) => "/apps/app-1" + path),
  ...["", "/capacity", "/workspaces", "/users", "/apps"].map(
    (path) => "/admin" + path,
  ),
];

for (const route of routes) {
  test(`Chinese copy on ${route}`, async ({ page }) => {
    await page.context().addCookies([
      {
        name: "asobeast_language",
        value: "zh-CN",
        url: "http://localhost:3000",
      },
    ]);
    if (route.endsWith("/setup")) await startedSetup(page.context(), "app-1");
    await page.goto(route);
    const main = page.getByRole("main");
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
    await expect(main).toContainText(/[\u3400-\u9fff]/);
    if (route.endsWith("/keywords")) {
      await expect(main.getByText("导出 CSV").first()).toBeVisible();
      await expect(
        main.getByRole("tab", { name: /已发现 9 个/ }),
      ).toBeVisible();
      await expect(
        main.getByText("focus timer", { exact: true }).first(),
      ).toBeVisible();
    }
    if (route === "/alerts") {
      await expect(main).toContainText(/排名从/);
    }
    if (route === "/apps/app-1/actions") {
      await expect(main).toContainText("将「habit tracker」添加到元数据");
    }
    if (route.endsWith("/audit")) {
      await expect(main).toContainText("已评估 82% 的审计项目");
    }
    if (route.endsWith("/changes")) {
      await expect(main).toContainText("最近 90 天，商店详情页有 4 次变更");
    }
    if (route.endsWith("/metadata")) {
      await expect(main).toContainText("4 张截图中有 2 张含文案。");
    }
  });
}
