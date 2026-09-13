async function request(url, options) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      message = body.error || message;
    } catch {}
    throw new Error(message);
  }

  return response.json();
}

export const api = {
  folders: () => request("/api/folders"),
  resumes: (path = "") => request(`/api/resumes?path=${encodeURIComponent(path)}`),
  search: (q) => request(`/api/search?q=${encodeURIComponent(q)}`),
  favorites: () => request("/api/favorites"),
  addFavorite: (path) => request("/api/favorites", {
    method: "POST",
    body: JSON.stringify({ path })
  }),
  removeFavorite: (path) => request("/api/favorites", {
    method: "DELETE",
    body: JSON.stringify({ path })
  }),
  lastPreviews: () => request("/api/last-previews"),
  addPreview: (path) => request("/api/last-previews", {
    method: "POST",
    body: JSON.stringify({ path })
  }),
  deleteResume: (path) => request("/api/resumes", {
    method: "DELETE",
    body: JSON.stringify({ path })
  })
};