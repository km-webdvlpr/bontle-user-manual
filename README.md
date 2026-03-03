# Bontle User Manual (Benefit)

Static user manual site for `Bontle for Benefit - User Manual` built with plain HTML/CSS/JS for fast load and easy GitHub Pages hosting.

## Project structure

- `docs/index.html`
- `docs/styles.css`
- `docs/script.js`

Using `docs/` allows direct GitHub Pages hosting from the `main` branch with source set to `/docs`.

## Run locally

1. Open PowerShell in this folder.
2. Start a local static server:

```powershell
python -m http.server 8080 -d docs
```

3. Open: `http://localhost:8080`

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. In GitHub: `Settings` -> `Pages`.
3. Under **Build and deployment**, set:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/docs`
4. Save.

After deployment, the site URL format is:

```text
https://<github-username>.github.io/<repo-name>/
```

Example for the requested repo name:

```text
https://<github-username>.github.io/bontle-user-manual/
```