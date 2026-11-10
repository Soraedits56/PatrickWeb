const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Sunset Vibes",
    category: "Sunset & Aesthetic",
    description: "Capturing the sunset to ease out my mood.",
    image: "893849508_1505648131661913_8571032426206864317_n.jpg"
  },
  {
    id: 2,
    title: "Reporting with Classmates",
    category: "With classmates, during a group report presentation",
    description: "A moment of collaboration and shared effort, presenting our findings to the class.",
    image: "890717176_1385774273629956_9173313006553161084_n.jpg"
  },
  {
    id: 3,
    title: "with the whole classmates",
    category: "Celebrating Acquaintance Party",
    description: "A fun and memorable moment with my classmates.",
    image: "899330023_1459659452538532_391897696012485310_n.jpg"
  },
  {
    id: 4,
    title: "Solo Pic",
    category: "Looking good about myself",
    description: "Calculated moves, positional strategy, and quiet contemplation behind the board.",
    image: "896655351_1666906101450817_8290843131065102051_n.jpg"
  },
  {
    id: 5,
    title: "Us three in the room",
    category: "Trio in our section.",
    description: "Audio engineering sessions, rhythm experimentation, and sonic ideas.",
    image: "893311151_1468316425258122_832259769790610738_n.jpg"
  },
  {
    id: 6,
    title: "Chill afternoon sunset inside campus.",
    category: "A peaceful vibe after class",
    description: "A serene moment of relaxation after a long day of classes.",
    image: "892170606_1165625586148118_7652065414552365910_n.jpg"
  }
];

let currentFilter = "all";

function renderGallery(filterCategory = "all") {
  const galleryGrid = document.getElementById("galleryGrid");
  if (!galleryGrid) return;

  const filteredItems = filterCategory === "all"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category.toLowerCase() === filterCategory.toLowerCase());

  galleryGrid.innerHTML = "";

  if (filteredItems.length === 0) {
    galleryGrid.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 48px 24px; text-align: center; color: var(--muted); border: 1px dashed var(--line); border-radius: 16px;">
        No works found in this category.
      </div>
    `;
    return;
  }

  filteredItems.forEach(item => {
    const card = document.createElement("article");
    card.className = "gallery-card";
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `View ${item.title}`);

    card.innerHTML = `
      <div class="gallery-img-wrap">
        <img src="${item.image}" alt="${item.title}" loading="lazy">
        <span class="gallery-badge">${item.category}</span>
      </div>
      <div class="gallery-info">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <span class="gallery-view-btn">View artwork ↗</span>
      </div>
    `;

    const openItem = () => openGalleryModal(item);
    card.addEventListener("click", openItem);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openItem();
      }
    });

    galleryGrid.appendChild(card);
  });
}

function setupGalleryFilters() {
  const filterContainer = document.getElementById("galleryFilter");
  if (!filterContainer) return;

  const categories = ["all", ...new Set(GALLERY_ITEMS.map(item => item.category))];
  filterContainer.innerHTML = "";

  categories.forEach(category => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `filter-btn ${category === currentFilter ? "active" : ""}`;
    btn.textContent = category === "all" ? "All Works" : category;

    btn.addEventListener("click", () => {
      currentFilter = category;
      filterContainer.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderGallery(category);
    });

    filterContainer.appendChild(btn);
  });
}

function openGalleryModal(item) {
  const modal = document.getElementById("galleryModal");
  if (!modal) return;

  const modalImg = document.getElementById("modalImg");
  const modalCategory = document.getElementById("modalCategory");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");

  if (modalImg) modalImg.src = item.image;
  if (modalImg) modalImg.alt = item.title;
  if (modalCategory) modalCategory.textContent = item.category;
  if (modalTitle) modalTitle.textContent = item.title;
  if (modalDesc) modalDesc.textContent = item.description;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeGalleryModal() {
  const modal = document.getElementById("galleryModal");
  if (!modal) return;
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

function setupGalleryModalEvents() {
  const modal = document.getElementById("galleryModal");
  const closeBtn = document.getElementById("closeModalBtn");

  if (closeBtn) closeBtn.addEventListener("click", closeGalleryModal);

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeGalleryModal();
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeGalleryModal();
  });
}

setupGalleryFilters();
renderGallery("all");
setupGalleryModalEvents();
