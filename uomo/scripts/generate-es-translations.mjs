import fs from "node:fs/promises";
import path from "node:path";
import parser from "@babel/parser";
import traverseModule from "@babel/traverse";

const traverse = traverseModule.default;
const projectRoot = process.cwd();
const outputFile = path.join(projectRoot, "data/i18n/es.generated.json");
const sourceDirectories = ["app", "components", "data"];
const singleWordWhitelist = new Set([
  "About",
  "Accept",
  "Accessories",
  "Account",
  "Address",
  "Admin",
  "Apply",
  "Audio",
  "Beauty",
  "Blog",
  "Brands",
  "Cart",
  "Cars",
  "Checkout",
  "Close",
  "Color",
  "Contact",
  "Delivery",
  "Description",
  "English",
  "FAQ",
  "Filter",
  "Filters",
  "Home",
  "Instagram",
  "Join",
  "Login",
  "Logout",
  "Menu",
  "Pages",
  "Password",
  "Phone",
  "Popular",
  "Register",
  "Reviews",
  "Search",
  "Shop",
  "Size",
  "Sort",
  "Submit",
  "Subtotal",
  "Terms",
  "Wishlist"
]);

function normalizeText(value = "") {
  return value.replace(/\s+/g, " ").trim();
}

function isLikelyCssToken(value) {
  return (
    !value.includes(" ") &&
    /^[.#]?[a-z0-9_-]+$/i.test(value) &&
    !singleWordWhitelist.has(value)
  );
}

function isTranslatable(value) {
  if (!value || !/[A-Za-z]/.test(value)) {
    return false;
  }

  if (value.length < 2 || value.length > 220) {
    return false;
  }

  if (/^(use client|true|false|none|auto)$/i.test(value)) {
    return false;
  }

  if (
    /^(https?:|\/|\.\/|\.\.\/|#)/.test(value) ||
    /[_@]/.test(value) ||
    /[{}<>]/.test(value) ||
    /^[.[(]/.test(value) ||
    /\.(jpg|jpeg|png|svg|webp|mp4|ico|css|scss|js|jsx)$/i.test(value)
  ) {
    return false;
  }

  if (
    value.includes("bootstrap") ||
    value.includes("swiper") ||
    value.includes("js-") ||
    value.includes("calc(") ||
    value.includes("url(")
  ) {
    return false;
  }

  if (isLikelyCssToken(value)) {
    return false;
  }

  if (
    !value.includes(" ") &&
    /^[A-Za-z0-9-]+$/.test(value) &&
    !singleWordWhitelist.has(value) &&
    !/^[A-Z]{2,}$/.test(value) &&
    !/^[A-Z][a-z]+$/.test(value)
  ) {
    return false;
  }

  return true;
}

async function collectSourceFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (fullPath.includes(`${path.sep}data${path.sep}i18n`)) {
        continue;
      }
      files.push(...(await collectSourceFiles(fullPath)));
      continue;
    }

    if (/\.(jsx?|mjs)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function maybeCollectString(value, collector) {
  const normalized = normalizeText(value);
  if (isTranslatable(normalized)) {
    collector.add(normalized);
  }
}

async function collectStrings() {
  const collectedStrings = new Set();
  const allFiles = [];

  for (const directory of sourceDirectories) {
    allFiles.push(...(await collectSourceFiles(path.join(projectRoot, directory))));
  }

  for (const file of allFiles) {
    const source = await fs.readFile(file, "utf8");
    let ast;

    try {
      ast = parser.parse(source, {
        sourceType: "module",
        plugins: ["jsx"],
      });
    } catch (error) {
      console.warn(`Skipping ${path.relative(projectRoot, file)}: ${error.message}`);
      continue;
    }

    traverse(ast, {
      JSXText(nodePath) {
        maybeCollectString(nodePath.node.value, collectedStrings);
      },
      StringLiteral(nodePath) {
        if (
          nodePath.parent.type === "ImportDeclaration" ||
          nodePath.parent.type === "ExportAllDeclaration" ||
          nodePath.parent.type === "ExportNamedDeclaration"
        ) {
          return;
        }

        if (nodePath.parent.type === "JSXAttribute") {
          const attributeName = nodePath.parent.name?.name;
          if (
            [
              "className",
              "id",
              "href",
              "src",
              "target",
              "rel",
              "type",
              "key",
              "role",
            ].includes(attributeName)
          ) {
            return;
          }

          if (
            typeof attributeName === "string" &&
            (attributeName.startsWith("data-") || attributeName.startsWith("on"))
          ) {
            return;
          }
        }

        maybeCollectString(nodePath.node.value, collectedStrings);
      },
      TemplateElement(nodePath) {
        maybeCollectString(nodePath.node.value.raw, collectedStrings);
      },
    });
  }

  return [...collectedStrings].sort((a, b) => a.localeCompare(b));
}

async function translateToSpanish(text, attempt = 1) {
  const response = await fetch(
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${encodeURIComponent(
      text
    )}`,
    {
      headers: {
        "user-agent": "Mozilla/5.0",
      },
    }
  );

  if (!response.ok) {
    if (attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, attempt * 750));
      return translateToSpanish(text, attempt + 1);
    }

    throw new Error(`Translation request failed with status ${response.status}`);
  }

  const payload = await response.json();
  const translated = Array.isArray(payload?.[0])
    ? payload[0].map((entry) => entry[0]).join("")
    : text;

  return normalizeText(translated) || text;
}

async function runWithConcurrency(items, concurrency, worker) {
  let currentIndex = 0;

  const runners = Array.from({ length: concurrency }, async () => {
    while (currentIndex < items.length) {
      const itemIndex = currentIndex;
      currentIndex += 1;
      await worker(items[itemIndex], itemIndex);
    }
  });

  await Promise.all(runners);
}

async function main() {
  const existing = JSON.parse(
    await fs.readFile(outputFile, "utf8").catch(() => '{"exact":{}}')
  );
  const strings = await collectStrings();
  const translations = { ...(existing.exact || {}) };
  const pending = strings.filter((text) => !translations[text]);

  console.log(`Found ${strings.length} candidate strings.`);
  console.log(`Need to translate ${pending.length} new strings to Spanish.`);

  await runWithConcurrency(pending, 8, async (text, index) => {
    const translated = await translateToSpanish(text);
    translations[text] = translated;

    if ((index + 1) % 25 === 0 || index === pending.length - 1) {
      await fs.writeFile(
        outputFile,
        JSON.stringify(
          {
            exact: Object.fromEntries(
              Object.entries(translations).sort(([left], [right]) =>
                left.localeCompare(right)
              )
            ),
          },
          null,
          2
        ) + "\n"
      );

      console.log(`Translated ${index + 1}/${pending.length}`);
    }
  });

  console.log(`Spanish dictionary updated: ${path.relative(projectRoot, outputFile)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
