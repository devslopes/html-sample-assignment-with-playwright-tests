const {
  "liveServer.settings.port": liveServerPort,
} = require("../.vscode/settings.json");

// @ts-check
const { test, expect, describe } = require("@playwright/test");
const mainPageUrl = `http://localhost:${liveServerPort}/`;
const cleanArrFromEmptyItems = (arr) => arr.filter((item) => item !== "");

// Makes sure to back to the main page of the project before every next test
test.beforeEach(async ({   }) => {
  await page.goto("/");
});

describe("Environment and Global document's level tests", () => {
  // Makes sure the project's main page is available at the port the live Server is running at
  test.describe("Live Server started", () => {
    test("The project development server is running with Live Server", async ({
      page,
    }) => {
      expect(page.url()).toBe(mainPageUrl);
    });
  });

  // Makes sure the <!DOCTYPE> rule is set in the document
  test("Document has doctype rule set", async ({ page }) => {
    const doctype = await page.evaluate(() => document.doctype);
    expect(doctype).not.toBeNull();
  });
});

describe("Document's HEAD tests", () => {
  // Make sure the meta tag for charset is presented in the head
  test("The meta tag that defines document's charset should be set", async ({
    page,
  }) => {
    const metaCharset = await page
      .locator("head")
      .locator("meta[charset]")
      .count();
    expect(metaCharset).toBeGreaterThan(0);
  });

  // Make sure the responsive meta tag is in the head
  test("Head section has responsive meta tag", async ({ page }) => {
    const metaViewport = await page
      .locator("head")
      .locator(
        'meta[name="viewport"][content*="width=device-width"][content*="initial-scale=1.0"]'
      )
      .count();
    expect(metaViewport).toBeGreaterThan(0);
  });

  // Make sure the Document's title meets the requirement
  test.describe("The page title tests", () => {
    test("The document title should be `Sample project`", async ({ page }) => {
      await expect(page).toHaveTitle("Sample project");
    });
  });
});

describe("Body contents test", () => {
  // Make sure there are at least 2 child elements in the body
  test("There should be at least 2 elements in the body", async ({ page }) => {
    const count = await page.evaluate(() => {
      return Array.from(document.body.children).filter(
        (node) =>
          !["SCRIPT", "NOSCRIPT", "LINK", "STYLE"].includes(node.tagName)
      ).length;
    });
    expect(count).toBeGreaterThanOrEqual(2);
  });

  // Make sure there is a page heading and only one page heading inside the body
  test("There should be a single page heading HTML Element (<h1></h1>) set on the page", async ({
    page,
  }) => {
    const locator = page.locator("body").locator("h1");
    await expect(locator).toHaveCount(1);
  });

  // Make sure there is a paragraph element inside the body
  test("The Body should have a paragraph HTML Element (<p></p>)", async ({
    page,
  }) => {
    const locator = page.locator("body").locator("p");
    await expect(locator).toBeAttached();
  });

  // Make sure there is only one paragraph element in the body
  test("A single paragraph HTML Element (<p></p>) is set on the page", async ({
    page,
  }) => {
    const locator = page.locator("body").locator("p");
    await expect(locator).toHaveCount(1);
  });

  // Make sure the length of the text in the paragraph meets the requirements
  test("The paragraph of text has at least 20 words", async ({ page }) => {
    const paragraphTextLength = page.locator("body").locator("p").textContent();

    expect(
      await paragraphTextLength.then((content) => {
        return cleanArrFromEmptyItems(content?.trim().split(" ")).length;
      })
    ).toBeGreaterThanOrEqual(20);
  });
});
