import { useEffect, useMemo, useState } from "react";
import { api } from "./api/api.js";
import Header from "./components/header";
import SearchBar from "./components/search-bar.jsx";
import FolderList from "./components/folder-list.jsx";
import FavoriteSection from "./components/favorite-section.jsx";
import LastPreviewSection from "./components/last-preview-section.jsx";
import ResumeList from "./components/resume-list.jsx";
import ResumePreviewModal from "./components/resume-preview-modal.jsx";
import DeleteConfirmModal from "./components/delete-confirm-modal.jsx";
import EmptyState from "./components/empty-state.jsx";

function App() {
  const [folders, setFolders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [lastPreviews, setLastPreviews] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [folderPath, setFolderPath] = useState(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);

  const hydrate = async () => {
    const [folderData, favoritePaths, previewPaths] = await Promise.all([
      api.folders(),
      api.favorites(),
      api.lastPreviews()
    ]);

    setFolders(folderData);
    setFavorites(favoritePaths);
    setLastPreviews(previewPaths);
  };

  useEffect(() => {
    hydrate()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (folderPath === null) return;
    api.resumes(folderPath)
      .then(setResumes)
      .catch((err) => setError(err.message));
  }, [folderPath]);

  useEffect(() => {
    const q = search.trim();
    if (!q) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      api.search(q)
        .then(setSearchResults)
        .catch((err) => setError(err.message));
    }, 180);

    return () => clearTimeout(timer);
  }, [search]);

  const favoriteRecords = useMemo(
    () => favorites.map((path) => ({ path, name: path.split("/").at(-1), folder: path.split("/").slice(0, -1).join("/"), url: `/resume/${path.split("/").map(encodeURIComponent).join("/")}` })),
    [favorites]
  );

  const previewRecords = useMemo(
    () => lastPreviews.map((path) => ({ path, name: path.split("/").at(-1), folder: path.split("/").slice(0, -1).join("/"), url: `/resume/${path.split("/").map(encodeURIComponent).join("/")}` })),
    [lastPreviews]
  );

  const openPreview = async (resume) => {
    setSelected(resume);
    setError("");
    try {
      const updated = await api.addPreview(resume.path);
      setLastPreviews(updated);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleFavorite = async (resume) => {
    try {
      const updated = favoriteSet.has(resume.path)
        ? await api.removeFavorite(resume.path)
        : await api.addFavorite(resume.path);
      setFavorites(updated);
    } catch (err) {
      setError(err.message);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteResume(deleteTarget.path);
      setDeleteTarget(null);
      if (selected?.path === deleteTarget.path) setSelected(null);
      await hydrate();
      if (folderPath !== null) setResumes(await api.resumes(folderPath));
      if (search.trim()) setSearchResults(await api.search(search));
    } catch (err) {
      setError(err.message);
    }
  };

  const onSelectFolder = (path) => {
    setSearch("");
    setSearchResults([]);
    setFolderPath(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const backHome = () => {
    setFolderPath(null);
    setSearch("");
    setSearchResults([]);
  };

  const displayedSearch = search.trim() ? searchResults : null;

  return (
    <div className="app-shell">
      <Header folderPath={folderPath} onHome={backHome} />

      <main className="container">
        <SearchBar value={search} onChange={setSearch} />

        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <button onClick={() => setError("")}>Dismiss</button>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading resumes…</div>
        ) : displayedSearch ? (
          <section className="home-section">
            <div className="section-heading">
              <div>
                <h2>Search results</h2>
                <p>{searchResults.length} matching resume{searchResults.length === 1 ? "" : "s"}</p>
              </div>
            </div>
            <ResumeList
              resumes={searchResults}
              favorites={favoriteSet}
              onPreview={openPreview}
              onToggleFavorite={toggleFavorite}
              onDelete={setDeleteTarget}
            />
            {!searchResults.length && <EmptyState title="No resumes found" text={`Nothing matched “${search}”.`} />}
          </section>
        ) : folderPath !== null ? (
          <section className="home-section">
            <button className="back-link" onClick={backHome}>← All folders</button>
            <div className="section-heading">
              <div>
                <h2>{folderPath}</h2>
                <p>{resumes.length} resume{resumes.length === 1 ? "" : "s"}</p>
              </div>
            </div>
            <ResumeList
              resumes={resumes}
              favorites={favoriteSet}
              onPreview={openPreview}
              onToggleFavorite={toggleFavorite}
              onDelete={setDeleteTarget}
            />
            {!resumes.length && <EmptyState title="No PDFs here" text="This folder has no PDF resumes." />}
          </section>
        ) : (
          <>
            <FavoriteSection
              resumes={favoriteRecords}
              favorites={favoriteSet}
              onPreview={openPreview}
              onToggleFavorite={toggleFavorite}
              onDelete={setDeleteTarget}
            />
            <FolderList folders={folders} onSelect={onSelectFolder} />
            <LastPreviewSection
              resumes={previewRecords}
              favorites={favoriteSet}
              onPreview={openPreview}
              onToggleFavorite={toggleFavorite}
              onDelete={setDeleteTarget}
            />
          </>
        )}
      </main>

      {selected && (
        <ResumePreviewModal
          resume={selected}
          isFavorite={favoriteSet.has(selected.path)}
          onToggleFavorite={() => toggleFavorite(selected)}
          onDelete={() => setDeleteTarget(selected)}
          onClose={() => setSelected(null)}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          resume={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

export default App;
