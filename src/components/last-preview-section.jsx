import ResumeList from "./resume-list.jsx";

export default function LastPreviewSection({ resumes, favorites, onPreview, onToggleFavorite, onDelete }) {
  return (
    <section className="home-section">
      <div className="section-heading">
        <div>
          <h2>🕘 Last Previews</h2>
          <p>Your most recently opened resumes</p>
        </div>
        <span className="count">{resumes.length}</span>
      </div>
      {resumes.length ? (
        <ResumeList resumes={resumes} favorites={favorites} onPreview={onPreview} onToggleFavorite={onToggleFavorite} onDelete={onDelete} />
      ) : (
        <div className="section-empty">Open a resume and it will appear here.</div>
      )}
    </section>
  );
}