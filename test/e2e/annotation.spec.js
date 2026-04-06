import { test, expect } from "@playwright/test";

test.describe("Turkey annotation tool", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/localDemo.html");
    // Wait for start() to fully complete — class options are populated at the end
    await page.waitForFunction(
      () => {
        const select = document.getElementById("label_class");
        return select && select.options.length > 0;
      },
      { timeout: 15000 }
    );
  });

  test("loads the page with all UI elements", async ({ page }) => {
    await expect(page.locator("[data-testid=title]")).toBeVisible();
    await expect(page.locator("[data-testid=canvas]")).toBeVisible();
    await expect(page.locator("[data-testid=mode_button]")).toBeVisible();
    await expect(page.locator("[data-testid=delete_button]")).toBeVisible();
    await expect(page.locator("[data-testid=annotate_button]")).toBeVisible();
    await expect(page.locator("[data-testid=undo_button]")).toBeVisible();
    await expect(page.locator("[data-testid=reset_button]")).toBeVisible();
    await expect(page.locator("[data-testid=reposition_button]")).toBeVisible();
    await expect(
      page.locator("[data-testid=transparency_slider]")
    ).toBeVisible();
    await expect(page.locator("[data-testid=label_class]")).toBeVisible();
  });

  test("starts in dot mode", async ({ page }) => {
    const modeButton = page.locator("[data-testid=mode_button]");
    await expect(modeButton).toHaveValue("Mode: Dot");
  });

  test("populates class labels", async ({ page }) => {
    const count = await page.evaluate(
      () => document.getElementById("label_class").options.length
    );
    expect(count).toBe(20);
    const firstText = await page.evaluate(
      () => document.getElementById("label_class").options[0].text
    );
    expect(firstText).toBe("class0");
  });

  test("toggles instructions on title click", async ({ page }) => {
    const instruction = page.locator("[data-testid=instruction]");
    await expect(instruction).toBeHidden();

    await page.locator("[data-testid=title]").click();
    await expect(instruction).toBeVisible();

    await page.locator("[data-testid=title]").click();
    await expect(instruction).toBeHidden();
  });

  test("cycles annotation modes with mode button", async ({ page }) => {
    const modeButton = page.locator("[data-testid=mode_button]");
    await expect(modeButton).toHaveValue("Mode: Dot");

    await modeButton.click();
    await expect(modeButton).toHaveValue("Mode: Link");

    await modeButton.click();
    await expect(modeButton).toHaveValue("Mode: Polygon");

    await modeButton.click();
    await expect(modeButton).toHaveValue("Mode: Bbox");

    await modeButton.click();
    await expect(modeButton).toHaveValue("Mode: Dot");
  });

  test("cycles annotation modes with E key", async ({ page }) => {
    const modeButton = page.locator("[data-testid=mode_button]");
    await expect(modeButton).toHaveValue("Mode: Dot");

    await page.keyboard.press("e");
    await expect(modeButton).toHaveValue("Mode: Link");

    await page.keyboard.press("e");
    await expect(modeButton).toHaveValue("Mode: Polygon");
  });

  test("toggles delete mode with D key", async ({ page }) => {
    const deleteButton = page.locator("[data-testid=delete_button]");
    const annotateButton = page.locator("[data-testid=annotate_button]");

    await expect(annotateButton).toHaveClass(/btn-primary/);

    await page.keyboard.press("d");
    await expect(deleteButton).toHaveClass(/btn-primary/);

    await page.keyboard.press("d");
    await expect(annotateButton).toHaveClass(/btn-primary/);
  });

  test("toggles delete mode with buttons", async ({ page }) => {
    const deleteButton = page.locator("[data-testid=delete_button]");
    const annotateButton = page.locator("[data-testid=annotate_button]");

    await deleteButton.click();
    await expect(deleteButton).toHaveClass(/btn-primary/);

    await annotateButton.click();
    await expect(annotateButton).toHaveClass(/btn-primary/);
  });

  test("creates dot annotation on canvas click", async ({ page }) => {
    const canvas = page.locator("[data-testid=canvas]");
    await canvas.click({ position: { x: 100, y: 100 } });

    const count = await page.evaluate(() => annotations.length);
    expect(count).toBe(1);

    const ann = await page.evaluate(() => annotations[0]);
    expect(ann.mode).toBe("dot");
    expect(ann.class).toBe("class0");
  });

  test("creates polygon annotation with clicks and C key", async ({
    page,
  }) => {
    const modeButton = page.locator("[data-testid=mode_button]");

    // Switch to polygon mode
    await page.keyboard.press("e");
    await expect(modeButton).toHaveValue("Mode: Link");
    await page.keyboard.press("e");
    await expect(modeButton).toHaveValue("Mode: Polygon");

    const canvas = page.locator("[data-testid=canvas]");
    await canvas.click({ position: { x: 100, y: 100 } });
    await canvas.click({ position: { x: 200, y: 100 } });
    await canvas.click({ position: { x: 150, y: 200 } });

    // Points should be in currentPolygon, not yet committed
    let count = await page.evaluate(() => annotations.length);
    expect(count).toBe(0);

    // Close polygon
    await page.keyboard.press("c");

    count = await page.evaluate(() => annotations.length);
    expect(count).toBe(1);

    const ann = await page.evaluate(() => annotations[0]);
    expect(ann.mode).toBe("polygon");
    expect(ann.data.length).toBe(3);
  });

  test("undo removes the last dot annotation", async ({ page }) => {
    const canvas = page.locator("[data-testid=canvas]");
    await canvas.click({ position: { x: 100, y: 100 } });

    let count = await page.evaluate(() => annotations.length);
    expect(count).toBe(1);

    await page.locator("[data-testid=undo_button]").click();
    count = await page.evaluate(() => annotations.length);
    expect(count).toBe(0);
  });

  test("Ctrl+Z triggers undo", async ({ page }) => {
    const canvas = page.locator("[data-testid=canvas]");
    await canvas.click({ position: { x: 100, y: 100 } });

    let count = await page.evaluate(() => annotations.length);
    expect(count).toBe(1);

    await page.keyboard.press("Control+z");
    count = await page.evaluate(() => annotations.length);
    expect(count).toBe(0);
  });

  test("reset clears all annotations", async ({ page }) => {
    const canvas = page.locator("[data-testid=canvas]");
    await canvas.click({ position: { x: 100, y: 100 } });

    let count = await page.evaluate(() => annotations.length);
    expect(count).toBe(1);

    await page.locator("[data-testid=reset_button]").click();
    count = await page.evaluate(() => annotations.length);
    expect(count).toBe(0);
  });

  test("submit button shows output JSON", async ({ page }) => {
    const canvas = page.locator("[data-testid=canvas]");
    await canvas.click({ position: { x: 100, y: 100 } });

    // Verify annotation was created before submitting
    const annCount = await page.evaluate(() => annotations.length);
    expect(annCount).toBe(1);

    await page.locator("[data-testid=submitButton]").click();

    const outputLabel = page.locator("[data-testid=outputLabel]");
    await expect(outputLabel).toBeVisible();

    const outputText = await page.locator("[data-testid=output]").textContent();
    const parsed = JSON.parse(outputText);
    expect(parsed.length).toBe(1);
    expect(parsed[0].mode).toBe("dot");
  });

  test("changing class label changes annotation class", async ({ page }) => {
    const select = page.locator("[data-testid=label_class]");
    await select.selectOption({ index: 2 });

    const canvas = page.locator("[data-testid=canvas]");
    await canvas.click({ position: { x: 100, y: 100 } });

    const ann = await page.evaluate(() => annotations[0]);
    expect(ann.class).toBe("class2");
  });

  test("transparency slider is interactive", async ({ page }) => {
    const slider = page.locator("[data-testid=transparency_slider]");
    await expect(slider).toBeVisible();
    await slider.fill("75");
    const value = await slider.inputValue();
    expect(value).toBe("75");
  });
});
