export default function FolderList({ folders, onSelect }) {
  return (
    <section>
      <div className="section-heading">
        <div>
          <h2>Folders</h2>
          <p>Browse the resume collection by folder</p>
        </div>
        <span className="count">{folders.length}</span>
      </div>

      <div className="folder-grid">
        {folders.map((folder) => (
          <button className="folder-card" key={folder.path} onClick={() => onSelect(folder.path)}>
            <span className="folder-icon">📁</span>
            <span className="folder-info">
              <strong>{folder.name}</strong>
              <small>{folder.resumeCount} resume{folder.resumeCount === 1 ? "" : "s"}</small>
            </span>
            <span className="chevron">›</span>
          </button>
        ))}
      </div>
    </section>
  );
}