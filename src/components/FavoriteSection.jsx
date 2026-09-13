import ResumeList from "./ResumeList.jsx";

export default function FavoriteSection({ resumes, favorites, onPreview, onToggleFavorite, onDelete }) {
  return (
    <section className="home-section">
      <div className="section-heading">
        <div>
          <h2>⭐ Favorites</h2>
          <p>Your starred resumes</p>
        </div>
        <span className="count">{resumes.length}</span>
      </div>
      {resumes.length ? (
        <ResumeList resumes={resumes} favorites={favorites} onPreview={onPreview} onToggleFavorite={onToggleFavorite} onDelete={onDelete} />
      ) : (
        <div className="section-empty">Star a resume and it will appear here.</div>
      )}
    </section>
  );
}