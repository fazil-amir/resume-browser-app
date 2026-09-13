export default function ResumeList({ resumes, favorites, onPreview, onToggleFavorite, onDelete }) {
  return (
    <div className="resume-grid">
      {resumes.map((resume) => (
        <article className="resume-card" key={resume.path}>
          <button
            type="button"
            className="resume-main"
            onClick={() => onPreview(resume)}
            title={`Preview ${resume.name}`}
          >
            <span className="pdf-icon" aria-hidden="true">PDF</span>
            <span className="resume-info">
              <strong>{resume.name}</strong>
              <small>{resume.folder || "Root"}</small>
            </span>
            <span className="preview-arrow" aria-hidden="true">↗</span>
          </button>

          <div className="row-actions">
            <button
              type="button"
              className={`star-button ${favorites.has(resume.path) ? "active" : ""}`}
              onClick={() => onToggleFavorite(resume)}
              aria-label={favorites.has(resume.path) ? "Remove favorite" : "Add favorite"}
              title={favorites.has(resume.path) ? "Remove favorite" : "Add favorite"}
            >
              {favorites.has(resume.path) ? "★" : "☆"}
            </button>
            <button type="button" className="delete-button" onClick={() => onDelete(resume)} title="Delete resume" aria-label={`Delete ${resume.name}`}>
              🗑
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
