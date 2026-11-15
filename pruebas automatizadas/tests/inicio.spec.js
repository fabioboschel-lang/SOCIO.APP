import { test, expect } from "@playwright/test";

test("la aplicación carga y muestra la pantalla de sesión", async ({ page }) => {
  const erroresJavaScript = [];
  const respuestasFallidas = [];
  const solicitudesFallidas = [];

  page.on("pageerror", error => {
    erroresJavaScript.push(error.message);
  });

  page.on("response", response => {
    if (response.status() >= 400) {
      respuestasFallidas.push(
        `${response.status()} ${response.url()}`
      );
    }
  });

  page.on("requestfailed", request => {
    solicitudesFallidas.push(
      `${request.url()} — ${request.failure()?.errorText ?? "error desconocido"}`
    );
  });

  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#googleBtn")).toBeVisible();
  await expect(page.locator(".session-view")).toBeVisible();
  await expect(page).toHaveTitle("PassFlow");

  expect(
    erroresJavaScript,
    "Se detectaron excepciones JavaScript no controladas."
  ).toEqual([]);

  expect(
    respuestasFallidas,
    "Se detectaron respuestas HTTP con error."
  ).toEqual([]);

  expect(
    solicitudesFallidas,
    "Se detectaron solicitudes de red fallidas."
  ).toEqual([]);
});
