#!/usr/bin/env node
/**
 * Lightweight consistency checker for this GitHub Pages portfolio.
 *
 * Usage:
 *   node tools/check-site.mjs
 *
 * It checks whether local URLs listed in posts/*/index.json exist as files.
 */

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const indexes = [
  "posts/blog/index.json",
  "posts/bsis/index.json",
  "posts/postech/index.json",
  "posts/lecture/index.json",
];

let hasIssue = false;

for (const indexPath of indexes) {
  const fullPath = path.join(root, indexPath);

  if (!fs.existsSync(fullPath)) {
    console.warn(`[missing index] ${indexPath}`);
    hasIssue = true;
    continue;
  }

  let items;
  try {
    items = JSON.parse(fs.readFileSync(fullPath, "utf8"));
  } catch (error) {
    console.warn(`[invalid json] ${indexPath}: ${error.message}`);
    hasIssue = true;
    continue;
  }

  for (const item of items) {
    if (!item.url || /^https?:\/\//i.test(item.url)) continue;

    const localPath = path.join(root, String(item.url).replace(/^\//, ""));
    if (!fs.existsSync(localPath)) {
      console.warn(`[broken local url] ${indexPath} -> ${item.url}`);
      hasIssue = true;
    }
  }
}

if (hasIssue) {
  process.exitCode = 1;
} else {
  console.log("No broken local post URLs found.");
}
