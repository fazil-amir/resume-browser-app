export default function Header({ folderPath, onHome }) {
  return (
    <header className="header">
      <div className="header-inner">
        <button className="brand" onClick={onHome}>
          <span className="brand-icon">R</span>
          <span>Resume Browser</span>
        </button>
        {folderPath && <span className="header-context">/ {folderPath}</span>}
      </div>
    </header>
  );
}