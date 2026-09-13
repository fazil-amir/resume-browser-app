import path from "node:path";
import { RESUME_ROOT } from "../config.js";

export function normalizeRelativePath(value = "") {
  return value.replaceAll("\\", "/").replace(/^\/+/, "");
}

export function safeResumePath(relativePath) {
  const normalized = normalizeRelativePath(relativePath);
  const absolute = path.resolve(RESUME_ROOT, normalized);
  const rootWithSep = RESUME_ROOT.endsWith(path.sep)
    ? RESUME_ROOT
    : RESUME_ROOT + path.sep;

  if (absolute !== RESUME_ROOT && !absolute.startsWith(rootWithSep)) {
    const error = new Error("Invalid resume path.");
    error.status = 400;
    throw error;
  }

  return absolute;
}

export function toUrlPath(relativePath) {
  return `/resume/${normalizeRelativePath(relativePath)
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}

export function isPdf(filePath) {
  return path.extname(filePath).toLowerCase() === ".pdf";
}