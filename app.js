/* ==========================================
   CHRIST & LUMIÈRE — app.js
   ========================================== */

'use strict';

// ========== CONFIG ==========
// Change this password to whatever you want!
const ADMIN_PASSWORD = 'Betsaleel2026';

// ========== STORAGE KEYS ==========
const MSG_KEY      = 'christlumiere_messages';
const COMMENT_KEY  = 'christlumiere_comments';
const SESSION_KEY  = 'christlumiere_admin';

// ========== DEMO MESSAGES ==========
const DEMO_MESSAGES = [
  {
    id: '1',
    title: "La puissance de la résurrection",
    verse: "1 Corinthiens 15:55",
    verseText: "Ô mort, où est ta victoire ? Ô mort, où est ton aiguillon ?",
    content: "La résurrection de Jésus-Christ est le fondement de notre foi. Sans la résurrection, notre foi serait vaine. Mais grâce à Dieu, Jésus est sorti vivant du tombeau, vainqueur de la mort et du péché.\n\nCela signifie que nous aussi, nous avons accès à cette vie nouvelle. La mort n'a plus le dernier mot pour ceux qui croient en Jésus. Nous sommes des ressuscités en puissance, appelés à marcher dans la nouveauté de vie dès aujourd'hui.\n\nQue cette vérité remplisse ton cœur d'espérance : le même Esprit qui a ressuscité Jésus habite en toi si tu appartiens à Christ.",
    category: "Foi",
    date: "2025-06-01"
  },
  {
    id: '2',
    title: "L'amour qui ne faillit jamais",
    verse: "Romains 8:38-39",
    verseText: "Car j'ai l'assurance que ni la mort, ni la vie... ni aucune autre créature ne pourra nous séparer de l'amour de Dieu manifesté en Jésus-Christ notre Seigneur.",
    content: "Il existe des moments dans notre vie où nous nous sentons abandonnés, rejetés, ou indignes d'être aimés. Pourtant, la Bible nous révèle une vérité immuable : l'amour de Dieu pour nous ne dépend pas de nos performances.\n\nDieu n'a pas envoyé son Fils parce que nous étions parfaits. Il l'a envoyé alors que nous étions encore pécheurs. C'est cela la grâce : recevoir ce qu'on ne mérite pas.\n\nAujourd'hui, reçois cet amour dans ta vie. Laisse-le guérir tes blessures, restaurer ta confiance et transformer ton regard sur toi-même. Tu es aimé d'un amour éternel.",
    category: "Amour",
    date: "2025-06-05"
  },
  {
    id: '3',
    title: "La prière qui déplace les montagnes",
    verse: "Matthieu 17:20",
    verseText: "Si vous avez de la foi comme un grain de sénevé, vous direz à cette montagne: Déplace-toi d'ici là, et elle se déplacera.",
    content: "La prière n'est pas une simple habitude religieuse. C'est une conversation intime avec le Dieu vivant. C'est le moyen par lequel nous nous connectons à la source de toute puissance et de toute sagesse.\n\nBeaucoup abandonnent la prière parce qu'ils ne voient pas de résultats immédiats. Mais Dieu travaille selon ses temps, pas les nôtres. Notre rôle est de persévérer dans la foi et de croire que Celui à qui nous parlons est capable.\n\nPrie aujourd'hui. Prie pour toi, pour ta famille, pour les nations. La prière du juste a une grande efficace.",
    category: "Prière",
    date: "2025-06-08"
  }
];

// ========== DEMO COMMENTS ==========
const DEMO_COMMENTS = [
  {
    id: 'c1',
    name: 'Esther',
    country: 'Burkina Faso',
    text: "Ce site m'a touché au cœur. La prière d'acceptation m'a aidée à m'approcher de Dieu. Merci pour ce travail béni !",
    stars: 5,
    date: '2025-06-10'
  },
  {
    id: 'c2',
    name: 'Samuel',
    country: 'Côte d\'Ivoire',
    text: "Les messages bibliques sont très édifiants. Dieu bénisse le créateur de ce site. Je reviendrai souvent !",
    stars: 5,
    date: '2025-06-12'
  }
];

// ========== STATE ==========
let messages   = [];
let comments   = [];
let activeFilter = 'all';
let editingId  = null;
let isAdmin    = false;
let selectedStars = 0;

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
  loadMessages();
  loadComments();
  checkAdminSession();
  renderMessages();
  renderComments();
  initNavbar();
  initHamburger();
  initFilterBar();
  initReveal();
  initSmoothScroll();
  initAdminPanel();
  initModal();
  initCommentForm();
  createToast();
});

// ========== STORAGE ==========
function loadMessages() {
  try {
    const s = localStorage.getItem(MSG_KEY);
    messages = s ? JSON.parse(s) : [...DEMO_MESSAGES];
    if (!s) saveMessages();
  } catch(e) { messages = [...DEMO_MESSAGES]; }
}
function saveMessages() {
  try { localStorage.setItem(MSG_KEY, JSON.stringify(messages)); } catch(e) {}
}
function loadComments() {
  try {
    const s = localStorage.getItem(COMMENT_KEY);
    comments = s ? JSON.parse(s) : [...DEMO_COMMENTS];
    if (!s) saveComments();
  } catch(e) { comments = [...DEMO_COMMENTS]; }
}
function saveComments() {
  try { localStorage.setItem(COMMENT_KEY, JSON.stringify(comments)); } catch(e) {}
}

// ========== ADMIN AUTH ==========
function checkAdminSession() {
  isAdmin = sessionStorage.getItem(SESSION_KEY) === '1';
  applyAdminState();
}

function applyAdminState() {
  const iface = document.getElementById('admin-interface');
  const loginRow = document.querySelector('.admin-login-row');
  if (isAdmin) {
    iface && iface.classList.remove('hidden');
    loginRow && loginRow.classList.add('hidden');
    document.body.classList.add('admin-mode');
  } else {
    iface && iface.classList.add('hidden');
    loginRow && loginRow.classList.remove('hidden');
    document.body.classList.remove('admin-mode');
  }
}

function initAdminPanel() {
  // Access button
  const accessBtn = document.getElementById('admin-access-btn');
  const loginForm = document.getElementById('admin-login-form');
  const loginBtn  = document.getElementById('admin-login-btn');
  const cancelLogin = document.getElementById('admin-cancel-login-btn');
  const pwdInput  = document.getElementById('admin-password');
  const loginErr  = document.getElementById('login-error');

  accessBtn && accessBtn.addEventListener('click', () => {
    loginForm.classList.toggle('hidden');
    if (!loginForm.classList.contains('hidden')) pwdInput.focus();
  });

  cancelLogin && cancelLogin.addEventListener('click', () => {
    loginForm.classList.add('hidden');
    pwdInput.value = '';
    loginErr.classList.add('hidden');
  });

  function tryLogin() {
    if (pwdInput.value === ADMIN_PASSWORD) {
      isAdmin = true;
      sessionStorage.setItem(SESSION_KEY, '1');
      loginForm.classList.add('hidden');
      pwdInput.value = '';
      loginErr.classList.add('hidden');
      applyAdminState();
      renderComments();
      showToast('✝ Bienvenue, Administrateur !');
    } else {
      loginErr.classList.remove('hidden');
      shake(pwdInput);
      pwdInput.select();
    }
  }

  loginBtn && loginBtn.addEventListener('click', tryLogin);
  pwdInput && pwdInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') tryLogin(); });

  // Logout
  const logoutBtn = document.getElementById('admin-logout-btn');
  logoutBtn && logoutBtn.addEventListener('click', () => {
    isAdmin = false;
    sessionStorage.removeItem(SESSION_KEY);
    applyAdminState();
    hideForm();
    renderComments();
    showToast('Session admin terminée.');
  });

  // Toggle add form
  const toggleFormBtn = document.getElementById('toggle-form-btn');
  const saveMsgBtn    = document.getElementById('save-msg-btn');
  const cancelMsgBtn  = document.getElementById('cancel-msg-btn');

  toggleFormBtn && toggleFormBtn.addEventListener('click', () => {
    const form = document.getElementById('add-message-form');
    if (form.classList.contains('hidden')) {
      showForm();
    } else {
      hideForm();
    }
  });

  saveMsgBtn  && saveMsgBtn.addEventListener('click', saveMessage);
  cancelMsgBtn && cancelMsgBtn.addEventListener('click', () => { hideForm(); editingId = null; });
}

function showForm() {
  const form = document.getElementById('add-message-form');
  const btn  = document.getElementById('toggle-form-btn');
  form && form.classList.remove('hidden');
  if (btn) {
    btn.innerHTML = '<i class="fas fa-times"></i> Fermer';
    btn.classList.add('btn-ghost');
    btn.classList.remove('btn-primary');
  }
}
function hideForm() {
  const form = document.getElementById('add-message-form');
  const btn  = document.getElementById('toggle-form-btn');
  form && form.classList.add('hidden');
  if (btn) {
    btn.innerHTML = '<i class="fas fa-plus"></i> Ajouter un message';
    btn.classList.remove('btn-ghost');
    btn.classList.add('btn-primary');
  }
  clearForm();
}
function clearForm() {
  ['msg-title','msg-verse','msg-verse-text','msg-content'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const cat = document.getElementById('msg-category');
  if (cat) cat.value = 'Foi';
  editingId = null;
  const formTitle = document.querySelector('#add-message-form h3');
  if (formTitle) formTitle.textContent = 'Nouveau message biblique';
  const saveBtn = document.getElementById('save-msg-btn');
  if (saveBtn) saveBtn.innerHTML = '<i class="fas fa-save"></i> Publier';
}

function saveMessage() {
  const title   = document.getElementById('msg-title').value.trim();
  const content = document.getElementById('msg-content').value.trim();
  if (!title)   { shake(document.getElementById('msg-title'));   return; }
  if (!content) { shake(document.getElementById('msg-content')); return; }

  const verse     = document.getElementById('msg-verse').value.trim();
  const verseText = document.getElementById('msg-verse-text').value.trim();
  const category  = document.getElementById('msg-category').value;

  if (editingId) {
    const idx = messages.findIndex(m => m.id === editingId);
    if (idx !== -1) messages[idx] = { ...messages[idx], title, verse, verseText, content, category };
    editingId = null;
    showToast('Message mis à jour !');
  } else {
    messages.unshift({ id: Date.now().toString(), title, verse, verseText, content, category, date: today() });
    showToast('Message publié avec succès !');
  }
  saveMessages();
  hideForm();
  renderMessages();
}

function startEdit(id) {
  const msg = messages.find(m => m.id === id);
  if (!msg) return;
  editingId = id;
  document.getElementById('msg-title').value     = msg.title;
  document.getElementById('msg-verse').value     = msg.verse || '';
  document.getElementById('msg-verse-text').value= msg.verseText || '';
  document.getElementById('msg-content').value   = msg.content;
  document.getElementById('msg-category').value  = msg.category;
  const formTitle = document.querySelector('#add-message-form h3');
  if (formTitle) formTitle.textContent = 'Modifier le message';
  const saveBtn = document.getElementById('save-msg-btn');
  if (saveBtn) saveBtn.innerHTML = '<i class="fas fa-save"></i> Mettre à jour';
  showForm();
  document.getElementById('add-message-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function deleteMessage(id) {
  if (!confirm('Supprimer ce message définitivement ?')) return;
  messages = messages.filter(m => m.id !== id);
  saveMessages();
  renderMessages();
  showToast('Message supprimé.');
}

// ========== RENDER MESSAGES ==========
function renderMessages() {
  const grid = document.getElementById('messages-grid');
  const empty = document.getElementById('empty-state');
  if (!grid) return;

  const filtered = activeFilter === 'all' ? messages : messages.filter(m => m.category === activeFilter);
  grid.innerHTML = '';

  if (filtered.length === 0) {
    empty && empty.classList.remove('hidden');
    return;
  }
  empty && empty.classList.add('hidden');
  filtered.forEach((msg, i) => grid.appendChild(createCard(msg, i)));
}

function createCard(msg, index) {
  const card = document.createElement('div');
  card.className = 'message-card';
  card.style.animationDelay = `${index * 0.08}s`;
  card.dataset.id = msg.id;

  const excerpt = msg.content.length > 130 ? msg.content.slice(0, 130).trim() + '...' : msg.content;

  card.innerHTML = `
    <div class="card-actions">
      <button class="card-btn edit" title="Modifier"><i class="fas fa-edit"></i></button>
      <button class="card-btn delete" title="Supprimer"><i class="fas fa-trash"></i></button>
    </div>
    <span class="card-category">${escHtml(msg.category)}</span>
    <h3 class="card-title">${escHtml(msg.title)}</h3>
    ${msg.verse ? `<p class="card-verse"><i class="fas fa-book" style="font-size:0.7rem;margin-right:0.4rem"></i>${escHtml(msg.verse)}</p>` : ''}
    <p class="card-excerpt">${escHtml(excerpt)}</p>
    <div class="card-footer">
      <span class="card-date">${formatDate(msg.date)}</span>
      <span class="card-read-more">Lire <i class="fas fa-arrow-right" style="font-size:0.65rem"></i></span>
    </div>`;

  // Show action buttons only if admin
  if (!isAdmin) {
    const actions = card.querySelector('.card-actions');
    if (actions) actions.style.display = 'none';
  }

  card.addEventListener('click', (e) => {
    if (e.target.closest('.card-btn')) return;
    openModal(msg);
  });
  card.querySelector('.card-btn.edit').addEventListener('click', (e) => {
    e.stopPropagation(); startEdit(msg.id);
  });
  card.querySelector('.card-btn.delete').addEventListener('click', (e) => {
    e.stopPropagation(); deleteMessage(msg.id);
  });
  return card;
}

// ========== FILTER ==========
function initFilterBar() {
  const filterBar = document.getElementById('filter-bar');
  filterBar && filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    renderMessages();
  });
}

// ========== MODAL ==========
function initModal() {
  const overlay = document.getElementById('modal-overlay');
  document.getElementById('modal-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}
function openModal(msg) {
  document.getElementById('modal-content').innerHTML = `
    <span class="card-category">${escHtml(msg.category)}</span>
    <h2>${escHtml(msg.title)}</h2>
    ${msg.verse ? `<div class="modal-verse"><strong>${escHtml(msg.verse)}</strong>${msg.verseText ? `<br/><em>"${escHtml(msg.verseText)}"</em>` : ''}</div>` : ''}
    <div class="modal-body">${escHtml(msg.content)}</div>
    <div class="modal-date"><i class="fas fa-calendar-alt"></i> Publié le ${formatDate(msg.date)}</div>`;
  document.getElementById('modal-overlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  document.body.style.overflow = '';
}

// ========== COMMENT FORM ==========
function initCommentForm() {
  // Star rating
  const stars = document.querySelectorAll('.star');
  stars.forEach(star => {
    star.addEventListener('click', () => {
      selectedStars = parseInt(star.dataset.val);
      stars.forEach((s, i) => {
        s.classList.toggle('active', i < selectedStars);
      });
    });
    star.addEventListener('mouseenter', () => {
      const val = parseInt(star.dataset.val);
      stars.forEach((s, i) => {
        s.style.color = i < val ? 'var(--gold)' : '';
      });
    });
  });
  document.getElementById('star-rating') && document.getElementById('star-rating').addEventListener('mouseleave', () => {
    stars.forEach((s, i) => {
      s.style.color = i < selectedStars ? 'var(--gold)' : '';
    });
  });

  // Char counter
  const cText = document.getElementById('c-text');
  const cChar = document.getElementById('c-char');
  cText && cText.addEventListener('input', () => {
    cChar.textContent = cText.value.length;
  });

  // Submit
  const submitBtn = document.getElementById('submit-comment-btn');
  submitBtn && submitBtn.addEventListener('click', submitComment);
}

function submitComment() {
  const name = document.getElementById('c-name').value.trim();
  const text = document.getElementById('c-text').value.trim();
  if (!name) { shake(document.getElementById('c-name')); return; }
  if (!text)  { shake(document.getElementById('c-text')); return; }

  const country = document.getElementById('c-country').value.trim();

  const newComment = {
    id: 'c' + Date.now(),
    name,
    country,
    text,
    stars: selectedStars || 0,
    date: today()
  };

  comments.unshift(newComment);
  saveComments();
  renderComments();

  // Reset form
  document.getElementById('c-name').value    = '';
  document.getElementById('c-country').value = '';
  document.getElementById('c-text').value    = '';
  document.getElementById('c-char').textContent = '0';
  selectedStars = 0;
  document.querySelectorAll('.star').forEach(s => { s.classList.remove('active'); s.style.color = ''; });

  showToast('Merci pour votre commentaire ! 🙏');
  document.getElementById('comments-list').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ========== RENDER COMMENTS ==========
function renderComments() {
  const list  = document.getElementById('comments-list');
  const empty = document.getElementById('empty-comments');
  if (!list) return;
  list.innerHTML = '';

  if (comments.length === 0) {
    empty && empty.classList.remove('hidden');
    return;
  }
  empty && empty.classList.add('hidden');

  comments.forEach((c, i) => {
    list.appendChild(createCommentCard(c, i));
  });
}

function createCommentCard(c, index) {
  const card = document.createElement('div');
  card.className = 'comment-card';
  card.style.animationDelay = `${index * 0.06}s`;

  const initials = c.name.trim().charAt(0).toUpperCase();
  const starsHtml = buildStars(c.stars);

  card.innerHTML = `
    <button class="comment-delete-btn" data-id="${c.id}" title="Supprimer"><i class="fas fa-trash"></i></button>
    <div class="comment-header">
      <div class="comment-author">
        <div class="author-avatar">${initials}</div>
        <div class="author-meta">
          <span class="author-name">${escHtml(c.name)}</span>
          ${c.country ? `<span class="author-country"><i class="fas fa-map-marker-alt" style="font-size:0.6rem"></i> ${escHtml(c.country)}</span>` : ''}
        </div>
      </div>
      ${c.stars > 0 ? `<div class="comment-stars">${starsHtml}</div>` : ''}
    </div>
    <p class="comment-text">"${escHtml(c.text)}"</p>
    <span class="comment-date"><i class="fas fa-calendar-alt"></i> ${formatDate(c.date)}</span>`;

  card.querySelector('.comment-delete-btn').addEventListener('click', () => {
    if (!isAdmin) return;
    if (!confirm('Supprimer ce commentaire ?')) return;
    comments = comments.filter(x => x.id !== c.id);
    saveComments();
    renderComments();
    showToast('Commentaire supprimé.');
  });
  return card;
}

function buildStars(count) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += `<span class="${i <= count ? '' : 'empty-star'}">★</span>`;
  }
  return html;
}

// ========== NAVBAR ==========
function initNavbar() {
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
    updateActiveNavLink();
  });
}
function updateActiveNavLink() {
  const sections = ['accueil','messages','commentaires','apropos'];
  const scrollY  = window.scrollY + 120;
  sections.forEach(id => {
    const el   = document.getElementById(id);
    const link = document.querySelector(`.nav-link[data-section="${id}"]`);
    if (!el || !link) return;
    if (scrollY >= el.offsetTop && scrollY < el.offsetTop + el.offsetHeight) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}

// ========== HAMBURGER ==========
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

// ========== SMOOTH SCROLL ==========
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
    });
  });
}

// ========== REVEAL ==========
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ========== TOAST ==========
function createToast() {
  const t = document.createElement('div');
  t.className = 'toast';
  t.id = 'toast';
  document.body.appendChild(t);
}
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ========== UTILS ==========
function today() { return new Date().toISOString().split('T')[0]; }
function formatDate(d) {
  if (!d) return '';
  try { return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }); }
  catch(e) { return d; }
}
function escHtml(s) {
  if (!s) return '';
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function shake(el) {
  if (!el) return;
  el.style.animation = 'none';
  void el.offsetHeight;
  el.style.animation = 'shake 0.4s ease';
  el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });
}

// Inject shake keyframes
const shakeCSS = document.createElement('style');
shakeCSS.textContent = '@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}';
document.head.appendChild(shakeCSS);
