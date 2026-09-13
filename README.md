# Resume Browser

A small local React + Node.js/Express app for browsing, previewing, searching, favoriting, and deleting PDF resumes.

## Folder layout

Put your entire resume collection directly inside the `resumes/` folder:

```text
resume-browser/
├── resumes/                  # PUT YOUR RESUME FOLDERS HERE
│   ├── Accountant/
│   │   ├── 0.pdf
│   │   ├── 1.pdf
│   │   └── ...
│   ├── Advocate/
│   ├── DataScience/
│   └── ...
├── data/
│   ├── favorites.json        # created locally for starred resumes
│   └── last-previews.json    # created locally for recent previews
├── src/                      # React + Node in the same source tree
├── index.html
├── package.json
└── vite.config.js
```

No separate frontend/backend directory is used.

## Start

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:4040
```

The app automatically scans `./resumes` recursively. You do **not** need to configure `RESUME_ROOT` if the resumes are inside this project.

## Local state

`data/favorites.json` and `data/last-previews.json` are personal, local state and are intentionally ignored by Git. On a fresh clone, the server creates both files automatically with empty lists when you run `npm run dev`. This means a fresh project starts cleanly without requiring data files to be committed.

If either file was committed before adding the ignore rule, untrack it once while keeping your local copy:

```bash
git rm --cached data/favorites.json data/last-previews.json
git add .gitignore data/.gitkeep
git commit -m "Ignore local resume browser state"
```

## Resume URLs

Every PDF is available at:

```text
http://localhost:4040/resume/<folder>/<subfolder>/<resume.pdf>
```

The UI's **Copy URL** button copies the exact URL for the selected PDF.

## Features

- Recursive folder scanning
- Search across resume filenames and paths
- Folder -> resume browsing
- PDF preview modal (does not open a new tab)
- Copy resume URL
- Star/unstar favorites
- Dedicated Favorites section
- Dedicated Last Previews section
- Favorites and history stored in separate JSON files
- Delete resume with confirmation
- Delete automatically removes it from favorites/history
- Simple React + CSS, no heavy UI library

## Optional configuration

The default is intentionally simple:

```text
RESUME_ROOT=./resumes
PORT=4040
```

You can override these with environment variables if needed.
