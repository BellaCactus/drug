// ─── COLLAPSIBLE ───
function toggleCategory(header) {
  const cat = header.closest('.category');
  cat.classList.toggle('open');
}

// ─── SIDEBAR SCROLL ───
function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // auto-open if it's a category
    if (el.classList.contains('category') && !el.classList.contains('open')) {
      el.classList.add('open');
    }
  }
}

// ─── SEARCH ───
const mainSearch = document.getElementById('main-search');
const searchCount = document.getElementById('search-count');
const noResults = document.getElementById('no-results');
const sidebarSearchInput = document.getElementById('sidebar-search-input');

let searchTimer;

function doSearch(query) {
  query = query.toLowerCase().trim();
  const cards = document.querySelectorAll('.drug-card');
  const categories = document.querySelectorAll('.category');
  let visibleCount = 0;

  // restore highlight first
  clearHighlights();

  if (!query) {
    cards.forEach(c => c.classList.remove('search-hidden'));
    categories.forEach(c => { /* keep user's open state */ });
    searchCount.textContent = '';
    noResults.style.display = 'none';
    return;
  }

  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    if (text.includes(query)) {
      card.classList.remove('search-hidden');
      visibleCount++;
      highlightInElement(card, query);
      // open parent category
      const cat = card.closest('.category');
      if (cat) cat.classList.add('open');
    } else {
      card.classList.add('search-hidden');
    }
  });

  // also check text-blocks
  const textBlocks = document.querySelectorAll('.text-block');
  textBlocks.forEach(block => {
    const text = block.textContent.toLowerCase();
    if (text.includes(query)) {
      highlightInElement(block, query);
      const cat = block.closest('.category');
      if (cat) cat.classList.add('open');
    }
  });

  // check tables
  document.querySelectorAll('.analog-table tr').forEach(row => {
    const text = row.textContent.toLowerCase();
    if (text.includes(query)) {
      row.style.background = 'rgba(57,255,20,0.04)';
      const cat = row.closest('.category');
      if (cat) cat.classList.add('open');
    } else {
      row.style.background = '';
    }
  });

  searchCount.textContent = visibleCount > 0 ? `${visibleCount} found` : '';
  noResults.style.display = visibleCount === 0 ? 'block' : 'none';
}

function highlightInElement(el, query) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let node;
  while ((node = walker.nextNode())) nodes.push(node);

  nodes.forEach(textNode => {
    const parent = textNode.parentNode;
    if (parent.tagName === 'MARK') return;
    const text = textNode.textContent;
    const lower = text.toLowerCase();
    const idx = lower.indexOf(query);
    if (idx === -1) return;

    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + query.length);
    const after = text.slice(idx + query.length);

    const frag = document.createDocumentFragment();
    if (before) frag.appendChild(document.createTextNode(before));
    const mark = document.createElement('mark');
    mark.textContent = match;
    frag.appendChild(mark);
    if (after) frag.appendChild(document.createTextNode(after));
    parent.replaceChild(frag, textNode);
  });
}

function clearHighlights() {
  document.querySelectorAll('mark').forEach(mark => {
    const parent = mark.parentNode;
    parent.replaceChild(document.createTextNode(mark.textContent), mark);
    parent.normalize();
  });
  document.querySelectorAll('.analog-table tr').forEach(row => {
    row.style.background = '';
  });
}

mainSearch.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => doSearch(mainSearch.value), 150);
  // sync sidebar
  if (sidebarSearchInput) sidebarSearchInput.value = mainSearch.value;
});

if (sidebarSearchInput) {
  sidebarSearchInput.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => doSearch(sidebarSearchInput.value), 150);
    mainSearch.value = sidebarSearchInput.value;
  });
}

// ─── ACTIVE NAV LINK ON SCROLL ───
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.page-section, .category[id]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(`'${id}'`)) {
          link.classList.add('active');
        }
      });
    }
  });
}, { rootMargin: '-20% 0px -70% 0px' });

sections.forEach(s => { if (s.id) observer.observe(s); });

// ─── IMAGE FALLBACK ───
document.querySelectorAll('.drug-img').forEach(img => {
  img.addEventListener('error', function() {
    this.style.display = 'none';
    const placeholder = this.nextElementSibling;
    if (placeholder && placeholder.classList.contains('drug-img-placeholder')) {
      placeholder.style.display = 'flex';
    }
  });
});
