import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

// scan rộng hơn để khỏi sót
const TARGET_DIRS = ["app", "components", "lib", "hooks", "types", "public"];
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".md", ".json", ".txt", ".css", ".html"]);

function hasCombiningMarks(str) {
  return /[\u0300-\u036f]/.test(str);
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".next", ".git"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

function decodeWithBom(buf) {
  // UTF-8 BOM
  if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    return { text: buf.slice(3).toString("utf8"), encoding: "utf8-bom" };
  }
  // UTF-16 LE BOM
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe) {
    return { text: buf.slice(2).toString("utf16le"), encoding: "utf16le-bom" };
  }
  // UTF-16 BE BOM
  if (buf.length >= 2 && buf[0] === 0xfe && buf[1] === 0xff) {
    // Node không có utf16be -> đổi byte pairs rồi decode le
    const swapped = Buffer.allocUnsafe(buf.length - 2);
    for (let i = 2; i < buf.length; i += 2) {
      swapped[i - 2] = buf[i + 1];
      swapped[i - 1] = buf[i];
    }
    return { text: swapped.toString("utf16le"), encoding: "utf16be-bom" };
  }
  // default: utf8
  return { text: buf.toString("utf8"), encoding: "utf8" };
}

function encodeWithBom(text, encoding) {
  if (encoding === "utf8-bom") return Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from(text, "utf8")]);
  if (encoding === "utf16le-bom") return Buffer.concat([Buffer.from([0xff, 0xfe]), Buffer.from(text, "utf16le")]);
  if (encoding === "utf16be-bom") {
    const le = Buffer.from(text, "utf16le");
    // swap back to BE and add BOM
    const be = Buffer.allocUnsafe(le.length);
    for (let i = 0; i < le.length; i += 2) {
      be[i] = le[i + 1];
      be[i + 1] = le[i];
    }
    return Buffer.concat([Buffer.from([0xfe, 0xff]), be]);
  }
  return Buffer.from(text, "utf8");
}

let changed = 0;

for (const folder of TARGET_DIRS) {
  const abs = path.join(ROOT, folder);
  if (!fs.existsSync(abs)) continue;

  for (const file of walk(abs)) {
    const ext = path.extname(file);
    if (!EXTENSIONS.has(ext)) continue;

    const buf = fs.readFileSync(file);
    const { text: raw, encoding } = decodeWithBom(buf);

    if (!hasCombiningMarks(raw)) continue;

    const normalized = raw.normalize("NFC");
    if (normalized !== raw) {
      fs.writeFileSync(file, encodeWithBom(normalized, encoding));
      changed++;
      console.log("✅ normalized:", path.relative(ROOT, file), `(${encoding})`);
    }
  }
}

console.log(`\nDone. Files changed: ${changed}`);
