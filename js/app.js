// Soundboard: load categories from sounds.json, render buttons, play one sound at a time.

// The audio element currently playing (so a new click can stop it first).
let current = null;
// The button currently marked as playing (to clear its highlight).
let currentButton = null;

function stopCurrent() {
  if (current) {
    current.pause();
    current.currentTime = 0;
  }
  if (currentButton) {
    currentButton.classList.remove("playing");
  }
  current = null;
  currentButton = null;
}

function makeButton(sound) {
  const button = document.createElement("button");
  button.className = "sound-button";
  button.type = "button";
  button.textContent = sound.label;

  // One Audio per button: preloads and lets a re-click restart instantly.
  const audio = new Audio(sound.file);
  audio.preload = "auto";

  // Clear the highlight when playback finishes on its own.
  audio.addEventListener("ended", () => {
    if (current === audio) stopCurrent();
  });

  button.addEventListener("click", () => {
    // Single-sound rule: stop whatever is playing, then play this one from the start.
    stopCurrent();
    current = audio;
    currentButton = button;
    button.classList.add("playing");
    audio.currentTime = 0;
    audio.play().catch((err) => {
      // Autoplay/format issues: drop the highlight and surface it in the console.
      console.error(`Could not play ${sound.file}:`, err);
      stopCurrent();
    });
  });

  return button;
}

function renderCategory(category) {
  const section = document.createElement("section");
  section.className = "category";

  const heading = document.createElement("h2");
  heading.textContent = category.name;
  section.appendChild(heading);

  const grid = document.createElement("div");
  grid.className = "grid";
  for (const sound of category.sounds) {
    grid.appendChild(makeButton(sound));
  }
  section.appendChild(grid);

  return section;
}

function showError(message) {
  const board = document.getElementById("board");
  board.innerHTML = "";
  const p = document.createElement("p");
  p.className = "error";
  p.textContent = message;
  board.appendChild(p);
}

async function init() {
  const board = document.getElementById("board");
  try {
    const response = await fetch("sounds.json", { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    const categories = data && Array.isArray(data.categories) ? data.categories : [];
    if (categories.length === 0) {
      showError("No categories found in sounds.json.");
      return;
    }

    board.innerHTML = "";
    for (const category of categories) {
      board.appendChild(renderCategory(category));
    }
  } catch (err) {
    console.error(err);
    showError(
      "Could not load sounds.json. If you opened this file directly, run a local " +
      "server instead (e.g. python3 -m http.server) and visit http://localhost:8000."
    );
  }
}

document.addEventListener("DOMContentLoaded", init);
