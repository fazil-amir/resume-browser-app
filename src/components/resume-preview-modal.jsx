import { useEffect, useState } from "react";

export default function ResumePreviewModal({
  resume,
  isFavorite,
  onToggleFavorite,
  onDelete,
  onClose
}) {
  const [copied, setCopied] = useState(false);
  const absoluteUrl = `${window.location.origin}${resume.url}`;

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.classList.add("modal-open");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("modal-open");
    };
  }, [onClose]);

  const copyUrl = async () => {
    await navigator.clipboard.writeText(absoluteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="preview-modal">
        <div className="modal-header">
          <div className="modal-title">
            <strong>{resume.name}</strong>
            <small>{resume.folder || "Root"}</small>
          </div>
          <div className="modal-header-actions">
            <button className={`star-button ${isFavorite ? "active" : ""}`} onClick={onToggleFavorite}>
              {isFavorite ? "★" : "☆"} {isFavorite ? "Favorited" : "Favorite"}
            </button>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
        </div>

        <div className="pdf-frame-wrap">
          <iframe title={resume.name} src={`${resume.url}#page=1&zoom=page-height`} className="pdf-frame" />
        </div>

        <div className="modal-footer">
          <div className="url-box" title={absoluteUrl}>{absoluteUrl}</div>
          <div className="modal-footer-actions">
            <button className="secondary-button" onClick={copyUrl}>
              {copied ? "✓ Copied" : "Copy URL"}
            </button>
            <button className="danger-button" onClick={onDelete}>🗑 Delete Resume</button>
          </div>
        </div>
      </div>
    </div>
  );
}