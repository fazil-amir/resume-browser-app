import fs from "node:fs/promises";
import path from "node:path";
import { RESUME_ROOT } from "../config.js";
import { isPdf, normalizeRelativePath, safeResumePath, toUrlPath } from "../utils/pathUtils.js";

async function walk(directory, relativeDirectory = "") {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;

    const relativePath = relativeDirectory
      ? `${relativeDirectory}/${entry.name}`
      : entry.name;
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      results.push(...await walk(absolutePath, relativePath));
    } else if (entry.isFile() && isPdf(entry.name)) {
      results.push(relativePath.replaceAll(path.sep, "/"));
    }
  }

  return results;
}

async function existsAsDirectory(absolutePath) {
  try {
    return (await fs.stat(absolutePath)).isDirectory();
  } catch {
    return false;
  }
}

export async function getAllResumes() {
  if (!(await existsAsDirectory(RESUME_ROOT))) return [];
  const paths = await walk(RESUME_ROOT);
  paths.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
  return paths.map(toResumeRecord);
}

export async function getFolders() {
  if (!(await existsAsDirectory(RESUME_ROOT))) return [];

  const all = await getAllResumes();
  const map = new Map();

  for (const item of all) {
    const parts = item.path.split("/");
    const top = parts[0];
    if (!map.has(top)) map.set(top, { name: top, path: top, resumeCount: 0 });
    map.get(top).resumeCount += 1;
  }

  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
}

export async function getResumes(relativeDirectory = "") {
  const normalized = normalizeRelativePath(relativeDirectory);
  const directory = safeResumePath(normalized);
  if (!(await existsAsDirectory(directory))) {
    const error = new Error("Folder not found.");
    error.status = 404;
    throw error;
  }

  const entries = await fs.readdir(directory, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;

    const relativePath = normalized ? `${normalized}/${entry.name}` : entry.name;
    const absolutePath = path.join(directory, entry.name);

    if (entry.isFile() && isPdf(entry.name)) {
      results.push(toResumeRecord(relativePath));
    } else if (entry.isDirectory()) {
      const nested = await walk(absolutePath, relativePath);
      results.push(...nested.map(toResumeRecord));
    }
  }

  return results.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }));
}

export function searchResumes(query, allResumes) {
  const q = query.trim().toLocaleLowerCase();
  if (!q) return [];

  return allResumes.filter((item) =>
    item.path.toLocaleLowerCase().includes(q) ||
    item.name.toLocaleLowerCase().includes(q)
  );
}

export async function deleteResume(relativePath) {
  const absolutePath = safeResumePath(relativePath);
  const stat = await fs.stat(absolutePath).catch(() => null);

  if (!stat || !stat.isFile() || !isPdf(absolutePath)) {
    const error = new Error("Resume not found.");
    error.status = 404;
    throw error;
  }

  await fs.unlink(absolutePath);
}

function toResumeRecord(relativePath) {
  const normalized = normalizeRelativePath(relativePath);
  const parts = normalized.split("/");
  const name = parts.at(-1);
  const folder = parts.length > 1 ? parts.slice(0, -1).join("/") : "";

  return {
    name,
    path: normalized,
    folder,
    url: toUrlPath(normalized)
  };
}