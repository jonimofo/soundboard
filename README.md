# 🔊 Soundboard

A tiny, single-page soundboard. Categories of buttons — click one to play a sound.
No build step, no framework: just plain HTML, CSS, and JavaScript, ready for GitHub Pages.

Only one sound plays at a time — clicking a new button stops the current one; clicking
the same button again restarts it.

## Project layout

```
index.html        Page shell
css/style.css     Styling (responsive grid, light/dark)
js/app.js         Loads sounds.json and wires up playback
sounds.json       The data: categories -> buttons -> audio files
sounds/           Audio files (ships with synthesized placeholder tones)
tools/            Script that generated the placeholder tones
```

## Add or change a sound

1. Put your audio file in `sounds/` (any browser-supported format works — `.mp3`, `.ogg`, `.wav`).
2. Add an entry to `sounds.json` under the category you want:

   ```json
   { "label": "My Sound", "file": "sounds/my-sound.mp3" }
   ```

   To add a whole new category, add another object to the `categories` array with its own `name` and `sounds` list.

That's it — no HTML edits needed.

The bundled `sounds/*.wav` files are just placeholder tones. Replace them with real audio
whenever you like. (You can regenerate the placeholders with `python3 tools/gen_placeholders.py`.)

## Run locally

Because the page loads `sounds.json` with `fetch`, opening `index.html` directly from your
file system (`file://`) won't work. Start a quick local server instead:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. In the repo: **Settings → Pages**.
3. Under **Build and deployment**, set **Source = Deploy from a branch**, branch = `main`, folder = `/ (root)`.
4. Save. Your soundboard will be live at `https://<your-username>.github.io/<repo-name>/`.

The `.nojekyll` file tells GitHub Pages to serve the files as-is (no Jekyll processing).
