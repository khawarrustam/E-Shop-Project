// shop.js - Shop Page JavaScript

// Check if user is logged in
function isLoggedIn() {
  return localStorage.getItem('loggedInUser') !== null;
}

// Get logged in user
function getLoggedInUser() {
  const user = localStorage.getItem('loggedInUser');
  return user ? JSON.parse(user) : null;
}

// Logout function
function logout() {
  // Store user's cart data before logout
  const user = getLoggedInUser();
  if (user) {
    const cart = localStorage.getItem('cart');
    if (cart) {
      // Store cart data with user's email as key
      localStorage.setItem(`cart_${user.email}`, cart);
    }
  }
  
  // Clear current cart and user session
  localStorage.removeItem('cart');
  localStorage.removeItem('loggedInUser');
  window.location.reload();
}

// --- Navbar & Footer Injection (reuse from main.js) ---
function getNavbarHTML() {
  const user = getLoggedInUser();
  const authLinks = user 
    ? `<li><a href="#" id="logout-btn">Logout (${user.name})</a></li>`
    : `<li><a href="login.html">Login</a></li>
       <li><a href="signup.html">Sign Up</a></li>`;

  return `
    <nav class="navbar container">
      <div class="navbar__logo">
        <a href="index.html">E-Shop</a>
      </div>
      <ul class="navbar__links">
        <li><a href="index.html">Home</a></li>
        <li><a href="shop.html">Shop</a></li>
        <li><a href="about.html">About</a></li>
        ${authLinks}
        <li class="navbar__cart">
          <a href="cart.html">
            <span class="cart-icon">🛒</span>
            <span id="cart-count">0</span>
          </a>
        </li>
      </ul>
      <button class="navbar__hamburger" id="hamburger-btn" aria-label="Open menu">
        <span></span><span></span><span></span>
      </button>
    </nav>
  `;
}

function getFooterHTML() {
  return `
    <div class="footer container">
      <div class="footer__links">
        <a href="index.html">Home</a>
        <a href="shop.html">Shop</a>
        <a href="about.html">About</a>
        <a href="login.html">Login</a>
        <a href="signup.html">Sign Up</a>
      </div>
          <div class="footer__contact">
      <span>Contact: rajputkhawarali@gmail.com</span>
      <span>Phone: +1 234 567 890</span>
    </div>
          <div class="footer__social">
      <a href="https://linkedin.com/in/khawarrustam" aria-label="LinkedIn" target="_blank">🔗</a>
      <a href="https://github.com/khawarrustam" aria-label="GitHub" target="_blank">📚</a>
    </div>
      <div class="footer__copyright">
        &copy; 2025 Tiers Limited internship E-Shop. All rights reserved.
      </div>
    </div>
  `;
}

function injectLayout() {
  const navbar = document.getElementById('navbar');
  if (navbar) navbar.innerHTML = getNavbarHTML();
  const footer = document.getElementById('footer');
  if (footer) footer.innerHTML = getFooterHTML();
}

function setupHamburger() {
  const hamburger = document.getElementById('hamburger-btn');
  const links = document.querySelector('.navbar__links');
  
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      links.classList.toggle('navbar__links--open');
    });
  }

  // Setup logout functionality
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }
}

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  document.getElementById('cart-count').textContent = cart.length;
}

function setupDarkMode() {
  const btn = document.getElementById('darkmode-toggle');
  if (btn) {
    btn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
    });
  }
}

// --- Shop Page Logic ---
const shopControls = document.getElementById('shop-controls');
const productGrid = document.getElementById('product-grid');

// Render search bar and category filter as buttons
function renderShopControls(categories) {
  shopControls.innerHTML = `
    <div class="shop-search">
      <input type="text" id="search-input" placeholder="Search for products..." />
    </div>
    <div class="shop-filters" id="shop-filters">
      <button class="shop-filter-btn active" data-category="all">All</button>
      ${categories.map(cat => `<button class="shop-filter-btn" data-category="${cat}">${cat.charAt(0).toUpperCase() + cat.slice(1)}</button>`).join('')}
    </div>
  `;
}

// Render loading spinner
function renderLoading() {
  productGrid.innerHTML = `<div class="shop-loading"><div class="shop-spinner"></div></div>`;
}

// Render products with premium card design and fade-in
function renderProducts(products) {
  if (!products.length) {
    productGrid.innerHTML = `<div class="shop-empty"><img src='https://cdn-icons-png.flaticon.com/512/4076/4076549.png' alt='No products' /><div>No products found.</div></div>`;
    return;
  }
  productGrid.innerHTML = `
    <div class="shop-product-grid">
      ${products.map((product, i) => `
        <div class="shop-product-card" style="animation-delay:${0.1 + i * 0.1}s">
          <div class="shop-product-card__img">
            <img src="${product.image}" alt="${product.title}" loading="lazy" />
          </div>
          <div class="shop-product-card__info">
            <div class="shop-product-card__title">${product.title}</div>
            <div class="shop-product-card__price">$${product.price.toFixed(2)}</div>
            <button class="shop-add-to-cart-btn">Add to Cart</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Render Footer with new structure and SVG icons
function renderFooter() {
  const footer = document.getElementById('footer');
  if (!footer) return;
  footer.innerHTML = `
    <div class="footer-content container">
      <div>
        <div class="footer-logo">E-Shop</div>
        <div class="footer-desc">Premium products, unbeatable prices. Your one-stop shop for fashion, electronics, and more.</div>
      </div>
      <div class="footer-links">
        <strong>Quick Links</strong>
        <a href="index.html">Home</a>
        <a href="shop.html">Shop</a>
        <a href="about.html">About</a>
        <a href="#">Contact</a>
      </div>
      <div class="footer-contact">
        <strong>Contact</strong>
        <span>Email: rajputkhawarali@gmail.com</span>
        <span>Phone: +1 234 567 890</span>
      </div>
      <div class="footer-social">
        <a href="https://linkedin.com/in/khawarrustam" aria-label="LinkedIn" title="LinkedIn" target="_blank">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
        </a>
        <a href="https://github.com/khawarrustam" aria-label="GitHub" title="GitHub" target="_blank">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
        </a>
      </div>
    </div>
    <div class="footer-copyright">&copy; 2025 Tiers Limited internship E-Shop. All rights reserved.</div>
  `;
}

// Helper: get category from URL
function getCategoryFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('category');
}

// Fetch products and categories
async function fetchProductsAndCategories() {
  renderLoading();
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      fetch('https://fakestoreapi.com/products'),
      fetch('https://fakestoreapi.com/products/categories')
    ]);
    const products = await productsRes.json();
    const categories = await categoriesRes.json();
    renderShopControls(categories);
    // Add data-id to each card for event handling
    products.forEach((p, i) => p._idx = i);
    // If category in URL, set filter and show only those products
    const urlCategory = getCategoryFromURL();
    if (urlCategory) {
      document.querySelectorAll('.shop-filter-btn').forEach(btn => {
        if (btn.getAttribute('data-category') === urlCategory) {
          btn.classList.add('active');
        }
      });
      renderProducts(products.filter(p => p.category === urlCategory));
    } else {
      renderProducts(products);
    }
    // Add data-id to each card for event handling
    document.querySelectorAll('.shop-product-card').forEach((el, i) => el.setAttribute('data-id', products[i].id));
    setupShopEvents(products, categories);
    // Update URL when category changes
    document.querySelectorAll('.shop-filter-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const cat = this.getAttribute('data-category');
        const url = new URL(window.location);
        if (cat === 'all') {
          url.searchParams.delete('category');
        } else {
          url.searchParams.set('category', cat);
        }
        window.history.replaceState({}, '', url);
      });
    });
  } catch (err) {
    productGrid.innerHTML = '<div class="shop-empty"><div>Failed to load products.</div></div>';
  }
}

// Setup search and filter events
function setupShopEvents(products, categories) {
  const searchInput = document.getElementById('search-input');
  const filterBtns = document.querySelectorAll('.shop-filter-btn');
  searchInput.addEventListener('input', () => filterAndRender(products));
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      filterAndRender(products);
    });
  });
  productGrid.addEventListener('click', (e) => {
    if (e.target.classList.contains('shop-add-to-cart-btn')) {
      const card = e.target.closest('.shop-product-card');
      const id = card.getAttribute('data-id');
      addToCart(products.find(p => p.id == id));
    } else if (e.target.closest('.shop-product-card')) {
      // Go to product details page
      const card = e.target.closest('.shop-product-card');
      const id = card.getAttribute('data-id');
      window.location.href = `product.html?id=${id}`;
    }
  });
}

// Filter and render products
function filterAndRender(products) {
  const search = document.getElementById('search-input').value.toLowerCase();
  const activeBtn = document.querySelector('.shop-filter-btn.active');
  const category = activeBtn ? activeBtn.getAttribute('data-category') : 'all';
  let filtered = products.filter(p =>
    (category === 'all' || p.category === category) &&
    (p.title.toLowerCase().includes(search) || p.description.toLowerCase().includes(search))
  );
  renderProducts(filtered);
  // If empty, add Reset Filters button
  if (!filtered.length) {
    const emptyDiv = document.querySelector('.shop-empty');
    if (emptyDiv) {
      emptyDiv.innerHTML += `<button class='shop-filter-btn' id='reset-filters'>Reset Filters</button>`;
      document.getElementById('reset-filters').onclick = () => {
        document.getElementById('search-input').value = '';
        document.querySelectorAll('.shop-filter-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.shop-filter-btn[data-category="all"]').classList.add('active');
        renderProducts(products);
      };
    }
  }
}

// Add to cart
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert('Added to cart!');
}

// On DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  injectLayout();
  setupHamburger();
  updateCartCount();
  setupDarkMode();
  fetchProductsAndCategories();
  renderFooter();
});

// --- Loading Spinner CSS (injected for demo) ---
const style = document.createElement('style');
style.innerHTML = `
.loading-spinner {
  border: 6px solid #f3f3f3;
  border-top: 6px solid var(--primary);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  animation: spin 1s linear infinite;
  margin: 3rem auto;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}
@media (max-width: 1023px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 767px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
}
.product-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(37,99,235,0.07);
  overflow: hidden;
  transition: box-shadow 0.3s, transform 0.3s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  min-height: 350px;
}
.product-card:hover {
  box-shadow: 0 6px 24px rgba(37,99,235,0.15);
  transform: translateY(-4px) scale(1.03);
}
.product-card__img {
  flex: 1 1 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #f1f5f9;
  transition: background 0.3s;
}
.product-card__img img {
  max-width: 100%;
  max-height: 180px;
  transition: transform 0.3s;
}
.product-card:hover .product-card__img img {
  transform: scale(1.08);
}
.product-card__info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.product-card__price {
  color: var(--primary);
  font-weight: 600;
  font-size: 1.1rem;
}
.add-to-cart-btn {
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}
.add-to-cart-btn:hover {
  background: var(--accent);
  transform: scale(1.05);
}
`;
document.head.appendChild(style); 