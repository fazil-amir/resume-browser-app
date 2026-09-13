# Resume Browser

Resume Browser is a local React and Express application for organizing, searching, previewing, favoriting, and deleting PDF resumes. It scans a directory tree on the server and presents the files through a browser-based interface.

## Requirements

- Node.js 20.19 or newer
- npm
- A local directory containing PDF resumes

The application does not upload resumes to a third-party service. Files and application state stay on the machine running the server.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:4040](http://localhost:4040). The development server runs Express and Vite together, so source changes are available without a separate frontend server.

Check that the server is healthy:

```bash
curl http://localhost:4040/api/health
```

Expected response:

```json
{"ok":true}
```

## Adding resumes

1. Open the repository's `resumes/` directory.
2. Create a folder for each category, company, role, or other grouping. For example:

	```text
	resumes/
	├── Accountant/
	├── Data Science/
	└── Frontend Engineer/
	```

3. Copy PDF files into the relevant folder:

	```text
	resumes/
	└── Frontend Engineer/
		 ├── Jane Doe.pdf
		 └── John Smith.pdf
	```

4. Refresh the browser. The server scans folders recursively, so nested folders are supported:

	```text
	resumes/
	└── Frontend Engineer/
		 └── 2026/
			  └── Jane Doe.pdf
	```

Only files whose extension is `.pdf` are displayed. The extension is case-insensitive, so `.PDF` also works. Hidden files and folders are skipped. File names can contain spaces; use ordinary file-system names and avoid moving files while someone is previewing or deleting them.

The first folder level is shown as a category in the interface. Resume paths remain relative to `resumes/`, for example `Frontend Engineer/2026/Jane Doe.pdf`.

### Important Git behavior

Resume files are intentionally excluded by `.gitignore`:

```gitignore
resumes/*
!resumes/.gitkeep
```

This keeps private resumes out of commits while preserving the empty directory in a fresh clone. Add resume files locally; do not force-add them unless you explicitly intend to put them in version control. The same rule applies to any nested folder under `resumes/`.

## Features

- Recursive discovery of PDF files
- Category and nested-folder browsing
- Search by file name or relative path
- In-browser PDF preview
- Copy the URL for a selected resume
- Favorite and unfavorite resumes
- Recently previewed resumes
- Confirmed deletion from disk
- Automatic removal of deleted files from favorites and preview history
- Health endpoint for monitoring

## Production deployment

Build the React client, then run the Express server in production mode:

```bash
npm run build
NODE_ENV=production npm start
```

The production server serves the compiled `dist/` directory and the resume files from the same Express process. It listens on port `4040` by default.

For a long-running deployment, run the process under a service manager such as `systemd`, Docker, or a process supervisor. Put authentication and HTTPS in front of the application before exposing it beyond a trusted local network. The application has destructive delete functionality and does not provide user authentication by itself.

## Configuration

Configuration is supplied through environment variables:

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `4040` | HTTP port used by Express. |
| `RESUME_ROOT` | `resumes` | Resume directory, resolved relative to the project root unless an absolute path is supplied. |
| `MAX_LAST_PREVIEWS` | `20` | Maximum number of recent preview paths stored in local state. |
| `NODE_ENV` | development behavior | Set to `production` to serve the built `dist/` client. |

Example using an external resume directory:

```bash
RESUME_ROOT=/Users/you/Documents/resumes PORT=8080 npm start
```

When using an external directory, the same rules apply: only PDFs are scanned, subdirectories are supported, and the server must have read and delete permission for the files.

## Local application state

The server creates these files automatically inside `data/`:

- `data/favorites.json` stores favorited relative paths.
- `data/last-previews.json` stores recently previewed relative paths.

Both files are ignored by Git, along with temporary `data/*.tmp` files. They are machine-specific state and should not be committed. If either file was tracked before the ignore rule existed, remove it from the Git index while keeping the local copy:

```bash
git rm --cached data/favorites.json data/last-previews.json
```

## Resume URLs and API

A resume is served at `/resume/<relative-path>`. For example:

```text
http://localhost:4040/resume/Frontend%20Engineer/2026/Jane%20Doe.pdf
```

The interface's **Copy URL** action generates the correctly encoded URL. Useful read endpoints include:

| Endpoint | Purpose |
| --- | --- |
| `GET /api/health` | Server health check. |
| `GET /api/folders` | Top-level folders and resume counts. |
| `GET /api/resumes?path=<folder>` | PDFs in a folder, including nested PDFs. |
| `GET /api/resumes/all` | All discovered PDFs. |
| `GET /api/search?q=<query>` | Search by name or path. |
| `GET /api/favorites` | Favorite paths. |
| `GET /api/last-previews` | Recent preview paths. |

## Project layout

```text
resume-browser/
├── data/                 # Local favorites and preview history
├── resumes/              # Local PDF collection, ignored by Git
├── src/                  # React client, Express server, routes, and services
├── index.html            # Vite HTML entry point
├── package.json          # Scripts and dependencies
└── vite.config.js        # Vite configuration
```

## Troubleshooting

**No resumes appear:** Confirm the files end in `.pdf`, are inside the configured resume root, and are not hidden files. Then refresh the page and check `GET /api/health`.

**The server cannot start:** Confirm dependencies are installed with `npm install`, the selected port is available, and `RESUME_ROOT` points to a directory the process can read.

**Production shows a missing client:** Run `npm run build` before `NODE_ENV=production npm start` and confirm that `dist/` exists.

**A deleted resume is still listed:** Refresh the page. Deletion removes the file and its matching favorite/history entries, but an already-open browser view may need to reload its data.

## License and privacy

This repository does not define a license. Add one before distributing the software. Treat resume PDFs as personal data and protect the host, backups, logs, and network access accordingly.
