import { FAVORITES_FILE } from "../config.js";
import { readJson, writeJson } from "../utils/jsonStore.js";

const DEFAULT = { favorites: [] };

async function read() {
  const data = await readJson(FAVORITES_FILE, DEFAULT);
  return {
    favorites: Array.isArray(data.favorites) ? data.favorites : []
  };
}

export async function getFavorites() {
  return (await read()).favorites;
}

export async function addFavorite(relativePath) {
  const data = await read();
  if (!data.favorites.includes(relativePath)) {
    data.favorites.unshift(relativePath);
    await writeJson(FAVORITES_FILE, data);
  }
  return data.favorites;
}

export async function removeFavorite(relativePath) {
  const data = await read();
  data.favorites = data.favorites.filter((item) => item !== relativePath);
  await writeJson(FAVORITES_FILE, data);
  return data.favorites;
}

export async function removeFromFavorites(relativePath) {
  return removeFavorite(relativePath);
}