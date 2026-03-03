const searchInput = document.getElementById("searchInput");
const sections = Array.from(document.querySelectorAll(".manual-section"));
const tiles = Array.from(document.querySelectorAll(".quick-links .tile"));
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const backdrop = document.getElementById("backdrop");

function getSectionCopyText(section) {
  const title = section.querySelector("h2")?.textContent?.trim() || "";
  const steps = Array.from(section.querySelectorAll(".steps li"))
    .map((li) => li.textContent.trim())
    .join("\n");
  return `${title}\n${steps}\nNotes:`;
}

function filterContent(query) {
  const normalized = query.trim().toLowerCase();
  sections.forEach((section) => {
    const haystack = section.dataset.search || section.textContent.toLowerCase();
    const visible = !normalized || haystack.includes(normalized);
    section.classList.toggle("hidden", !visible);
  });

  tiles.forEach((tile) => {
    const label = tile.textContent.toLowerCase();
    const target = tile.getAttribute("href")?.slice(1);
    const linkedSection = target ? document.getElementById(target) : null;
    const sectionVisible = linkedSection ? !linkedSection.classList.contains("hidden") : true;
    const visible = !normalized || label.includes(normalized) || sectionVisible;
    tile.style.display = visible ? "block" : "none";
  });
}

searchInput.addEventListener("input", (e) => {
  filterContent(e.target.value);
});

document.querySelectorAll(".copy-btn").forEach((button) => {
  button.addEventListener("click", async () => {
    const id = button.dataset.copyTarget;
    const section = id ? document.getElementById(id) : null;
    if (!section) {
      return;
    }

    const payload = getSectionCopyText(section);
    try {
      await navigator.clipboard.writeText(payload);
      const oldText = button.textContent;
      button.textContent = "Copied";
      setTimeout(() => {
        button.textContent = oldText;
      }, 1200);
    } catch {
      button.textContent = "Copy failed";
      setTimeout(() => {
        button.textContent = "Copy section";
      }, 1200);
    }
  });
});

function closeMenu() {
  sidebar.classList.remove("open");
  backdrop.classList.remove("show");
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", () => {
  const willOpen = !sidebar.classList.contains("open");
  sidebar.classList.toggle("open", willOpen);
  backdrop.classList.toggle("show", willOpen);
  menuToggle.setAttribute("aria-expanded", String(willOpen));
});

backdrop.addEventListener("click", closeMenu);

sidebar.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 1000) {
      closeMenu();
    }
  });
});