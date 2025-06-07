import { test, expect, describe } from "@playwright/test";
import fs from "fs";
import path from "path";
import { parse } from "node-html-parser";

const filePath = path.resolve(__dirname, "../index.html");
const htmlContent = fs.readFileSync(filePath, "utf8");

describe("Global Document level tests", async () => {
  // Make sure the Doctype rule with the html attribute with no value are set
  test("The doctype rule is set", async () => {
    const hasDoctype = htmlContent.toUpperCase().startsWith("<!DOCTYPE");
    expect(hasDoctype).toBe(true);
  });

  // Make sure the is a single html element in the document
  test("There is only a single HTML element in the document", async () => {
    const htmlMatches = htmlContent.match(/<html[\s\S]*?<\/html>/gi);
    expect(htmlMatches).not.toBeNull();
    expect(htmlMatches.length).toBe(1);
  });

  // Make sure there is nothing rather than DOCTYPE and HTML
  // on the global Document level
  test("Doctype and html element exist and only they are presented at the top level", async () => {
    const hasDoctype = htmlContent.startsWith("<!DOCTYPE");
    expect(hasDoctype).toBe(true);
    const root = parse(htmlContent); // Parse the HTML excluding doctype
    const topLevelNodes = root.childNodes.filter((node) => node.nodeType === 1);
    const htmlElement = topLevelNodes.find((node) => node.tagName === "HTML");
    expect(htmlElement).not.toBeUndefined();
    expect(topLevelNodes.length).toBe(1); // After doctype check, only HTML remains
  });
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
    expect(children.length).toBe(2);
  });
});
