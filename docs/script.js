const searchInput = document.getElementById("searchInput");
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const backdrop = document.getElementById("backdrop");
const roleButtons = Array.from(document.querySelectorAll(".role-chip"));
const decisionButtons = Array.from(document.querySelectorAll(".decision-option"));
const progressText = document.getElementById("sectionProgressText");
const roleFeedback = document.getElementById("roleFeedback");
const manualSections = Array.from(document.querySelectorAll(".manual-section"));
const trackedSections = Array.from(document.querySelectorAll("#role-entry, .manual-section"));
const tiles = Array.from(document.querySelectorAll(".quick-links .tile"));

const roleConfig = {
  all: {
    targets: [],
    anchor: "role-entry",
    label: "Showing the full manual. Use role selection to narrow the view and jump to the most relevant workflow."
  },
  customer: {
    targets: ["customer-booking", "customer-manage-booking"],
    anchor: "customer-booking",
    label: "Customer view highlights booking and manage-booking guidance first, while the rest of the manual stays available in the background."
  },
  consultant: {
    targets: ["consultant"],
    anchor: "consultant",
    label: "Consultant view prioritizes the live queue workflow and booking action decision helper."
  },
  "store-manager": {
    targets: ["store-manager"],
    anchor: "store-manager",
    label: "Store Manager view prioritizes queue monitoring, reassignments and escalation actions."
  },
  "area-manager": {
    targets: ["area-manager"],
    anchor: "area-manager",
    label: "Area Manager view emphasizes cross-store visibility, bottlenecks and regional reassignments."
  },
  executive: {
    targets: ["executive-national-focus", "exports-exec"],
    anchor: "executive-national-focus",
    label: "Executive view brings KPI review and exports together so reporting tasks are easier to scan."
  }
};

const decisionContent = {
  reschedule: {
    action: "Reschedule",
    next: "Select a new available slot, move the booking, release the old slot, and the customer receives an updated booking email.",
    note: "Use this when the customer or store needs the same booking moved to a different time."
  },
  cancel: {
    action: "Cancel",
    next: "The booking changes to Cancelled, the slot opens again, and the customer receives a cancellation email.",
    note: "Use this when the booking cannot continue at all, not when it just needs a new time."
  },
  request: {
    action: "Request reassignment",
    next: "A reassignment request is added to the ops or manager queue and stays tracked until a manager resolves it.",
    note: "Use this when a manager decision or controlled escalation is needed before the booking moves."
  },
  reassign: {
    action: "Reassign now",
    next: "The system hands the booking to another eligible consultant in the same store and logs the action for visibility.",
    note: "Use this for immediate handover when speed matters more than escalation."
  },
  "no-show": {
    action: "Mark no-show",
    next: "The booking is recorded as No-show for reporting and performance tracking after the store wait window has been followed.",
    note: "Use this only after the customer has not arrived and the store no-show policy has been met."
  }
};

let activeRole = "all";

function closeMenu() {
  sidebar.classList.remove("open");
  backdrop.classList.remove("show");
  menuToggle.setAttribute("aria-expanded", "false");
}

function isSectionVisible(section) {
  return !section.classList.contains("hidden-by-search");
}

function updateProgress() {
  const visibleTracked = trackedSections.filter(isSectionVisible);
  const current = visibleTracked.find((section) => {
    const rect = section.getBoundingClientRect();
    return rect.top <= 160 && rect.bottom >= 160;
  }) || visibleTracked[0];

  if (!current || !progressText) {
    return;
  }

  const heading = current.querySelector("h2, h3");
  progressText.textContent = heading ? heading.textContent.trim() : "Choose Role";
}

function syncSearchResults(query) {
  const normalized = query.trim().toLowerCase();

  manualSections.forEach((section) => {
    const haystack = section.dataset.search || section.textContent.toLowerCase();
    const visible = !normalized || haystack.includes(normalized);
    section.classList.toggle("hidden-by-search", !visible);
  });

  tiles.forEach((tile) => {
    const label = tile.textContent.toLowerCase();
    const target = tile.getAttribute("href")?.slice(1);
    const linkedSection = target ? document.getElementById(target) : null;
    const linkedVisible = linkedSection ? isSectionVisible(linkedSection) : true;
    const visible = !normalized || label.includes(normalized) || linkedVisible;
    tile.style.display = visible ? "block" : "none";
  });

  updateProgress();
}

function applyRoleState(role, shouldScroll = true) {
  activeRole = role;
  const config = roleConfig[role] || roleConfig.all;
  const prioritized = new Set(config.targets);

  roleButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.role === role);
  });

  manualSections.forEach((section) => {
    const isSupport = section.dataset.roleGroup === "support";
    const isPriority = prioritized.has(section.id);
    const deemphasize = role !== "all" && !isPriority && !isSupport;

    section.classList.toggle("is-prioritized", isPriority);
    section.classList.toggle("is-deemphasized", deemphasize);
  });

  if (roleFeedback) {
    roleFeedback.textContent = config.label;
  }

  updateProgress();

  if (shouldScroll) {
    const target = document.getElementById(config.anchor);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function initializeSupportLayout() {
  const supportZone = document.getElementById("shared-support");
  const loginGuide = document.getElementById("login-guide");
  const troubleshooting = document.getElementById("troubleshooting-demo");
  const troubleshootingWrapper = document.getElementById("troubleshootingWrapper");
  const footer = document.querySelector(".footer");

  if (!supportZone || !loginGuide || !troubleshooting || !troubleshootingWrapper || !footer) {
    return;
  }

  supportZone.insertBefore(loginGuide, troubleshootingWrapper);
  troubleshootingWrapper.appendChild(troubleshooting);
  supportZone.parentElement.insertBefore(supportZone, footer);
}

function nestExecutiveExport() {
  const executive = document.getElementById("executive-national-focus");
  const exportsSection = document.getElementById("exports-exec");

  if (!executive || !exportsSection) {
    return;
  }

  exportsSection.classList.add("exports-subsection");
  executive.appendChild(exportsSection);
}

function initializeDecisionHelper() {
  const actionNode = document.getElementById("decisionAction");
  const nextNode = document.getElementById("decisionNext");
  const noteNode = document.getElementById("decisionNote");

  if (!actionNode || !nextNode || !noteNode) {
    return;
  }

  decisionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.decision;
      const content = key ? decisionContent[key] : null;

      if (!content) {
        return;
      }

      decisionButtons.forEach((item) => {
        item.classList.toggle("active", item === button);
      });

      actionNode.textContent = content.action;
      nextNode.textContent = content.next;
      noteNode.textContent = content.note;
    });
  });
}

function initializeRoleSelector() {
  roleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const role = button.dataset.role || "all";
      applyRoleState(role);
    });
  });
}

searchInput?.addEventListener("input", (event) => {
  syncSearchResults(event.target.value);
});

menuToggle?.addEventListener("click", () => {
  const willOpen = !sidebar.classList.contains("open");
  sidebar.classList.toggle("open", willOpen);
  backdrop.classList.toggle("show", willOpen);
  menuToggle.setAttribute("aria-expanded", String(willOpen));
});

backdrop?.addEventListener("click", closeMenu);

sidebar?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 1000) {
      closeMenu();
    }
  });
});

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
window.addEventListener("hashchange", updateProgress);

initializeSupportLayout();
nestExecutiveExport();
initializeDecisionHelper();
initializeRoleSelector();
applyRoleState(activeRole, false);
syncSearchResults("");
updateProgress();
