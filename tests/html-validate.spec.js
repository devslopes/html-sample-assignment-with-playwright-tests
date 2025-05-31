const { test, expect, describe } = require("@playwright/test");
const fs = require("fs");
const { parse } = require("node-html-parser");
const path = require("path");

// Use __dirname and path to resolve the file path in CommonJS
const filePath = path.resolve(__dirname, "../index.html");
const htmlContent = fs.readFileSync(filePath, "utf8");

// Make sure the Doctype rule with the html attribute with no value are set
test("The doctype rule is set", async () => {
  const hasDoctype = htmlContent.startsWith("<!DOCTYPE");
  expect(hasDoctype).toBe(true);
});

// Make sure the is a single html element in the document
test("There is only a single HTML element in the document", async () => {
  const htmlMatches = htmlContent.match(/<html[\s\S]*?<\/html>/gi);
  expect(htmlMatches).not.toBeNull();
  expect(htmlMatches.length).toBe(1);
});

describe("HTML element tests", async () => {
  // Make sure there are 2 children inside HTML.
  // They are the HEAD and the BODY and there is a single instance of each
  test("The HEAD and BODY elements are set in HTML element", async () => {
    const headMatches = htmlContent.match(/<head[\s\S]*?<\/head>/gi);
    const bodyMatches = htmlContent.match(/<body[\s\S]*?<\/body>/gi);
    expect(headMatches).not.toBeNull();
    expect(bodyMatches).not.toBeNull();
    expect(headMatches.length).toBe(1);
    expect(bodyMatches.length).toBe(1);
  });

  // Make sure there are two children inside the HTML element total
  test("There should be 2 children inside the HTML element", async () => {
    const root = parse(htmlContent);
    const html = root.querySelector("html");
    expect(html).not.toBeNull();
    const children = html.childNodes.filter((node) => node.nodeType === 1);
    expect(children.length).toBe(2); // HEAD and BODY
  });
});
