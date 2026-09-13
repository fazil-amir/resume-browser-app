export default function DeleteConfirmModal({ resume, onCancel, onConfirm }) {
  return (
    <div className="modal-backdrop">
      <div className="confirm-modal">
        <div className="confirm-icon">🗑</div>
        <h2>Delete resume?</h2>
        <p>
          This will permanently delete <strong>{resume.name}</strong>.
        </p>
        <div className="confirm-path">{resume.path}</div>
        <p className="warning-text">This cannot be undone.</p>
        <div className="confirm-actions">
          <button className="secondary-button" onClick={onCancel}>Cancel</button>
          <button className="danger-button" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}