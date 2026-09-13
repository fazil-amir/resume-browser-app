import { LAST_PREVIEWS_FILE, MAX_LAST_PREVIEWS } from "../config.js";
import { readJson, writeJson } from "../utils/jsonStore.js";

const DEFAULT = { previews: [] };

async function read() {
  const data = await readJson(LAST_PREVIEWS_FILE, DEFAULT);
  return {
    previews: Array.isArray(data.previews) ? data.previews : []
  };
}

export async function getLastPreviews() {
  return (await read()).previews;
}

export async function addPreview(relativePath) {
  const data = await read();
  data.previews = [
    relativePath,
    ...data.previews.filter((item) => item !== relativePath)
  ].slice(0, MAX_LAST_PREVIEWS);

  await writeJson(LAST_PREVIEWS_FILE, data);
  return data.previews;
}

export async function removeFromPreviews(relativePath) {
  const data = await read();
  data.previews = data.previews.filter((item) => item !== relativePath);
  await writeJson(LAST_PREVIEWS_FILE, data);
  return data.previews;
}