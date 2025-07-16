// product.js - Product Details Page JavaScript

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
        <span>Contact: info@eshop.com</span>
        <span>Phone: +1 234 567 890</span>
      </div>
      <div class="footer__social">
        <a href="#" aria-label="Instagram">&#x1F4F7;</a>
        <a href="#" aria-label="Twitter">&#x1F426;</a>
        <a href="#" aria-label="Facebook">&#x1F4F1;</a>
      </div>
      <div class="footer__copyright">
        &copy; 2024 E-Shop. All rights reserved.
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

// --- Product Details Logic ---
const productDetails = document.getElementById('product-details');
const relatedProducts = document.getElementById('related-products');

// Get product ID from URL
function getProductId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// Render loading spinner
function renderLoading() {
  productDetails.innerHTML = `<div class="loading-spinner"></div>`;
}

// Render product details
function renderProduct(product) {
  productDetails.innerHTML = `
    <div class="product-detail container">
      <div class="product-detail__img">
        <img src="${product.image}" alt="${product.title}" />
      </div>
      <div class="product-detail__info">
        <h2>${product.title}</h2>
        <p class="product-detail__price">$${product.price.toFixed(2)}</p>
        <p class="product-detail__desc">${product.description}</p>
        <button class="add-to-cart-btn">Add to Cart</button>
      </div>
    </div>
  `;
}

// Render related products
function renderRelated(products, currentId) {
  relatedProducts.innerHTML = `
    <h3 class="container">Related Products</h3>
    <div class="product-grid container">
      ${products.filter(p => p.id != currentId).slice(0, 4).map(product => `
        <div class="product-card" data-id="${product.id}">
          <div class="product-card__img">
            <img src="${product.image}" alt="${product.title}" />
          </div>
          <div class="product-card__info">
            <h3>${product.title}</h3>
            <p class="product-card__price">$${product.price.toFixed(2)}</p>
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
        <span>Email: info@eshop.com</span>
        <span>Phone: +1 234 567 890</span>
      </div>
      <div class="footer-social">
        <a href="#" aria-label="Instagram" title="Instagram">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"/></svg>
        </a>
        <a href="#" aria-label="Twitter" title="Twitter">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.4 1.64a9.09 9.09 0 0 1-2.88 1.1A4.52 4.52 0 0 0 16.11 0c-2.5 0-4.52 2.02-4.52 4.52 0 .35.04.7.11 1.03C7.69 5.4 4.07 3.67 1.64 1.15c-.38.65-.6 1.4-.6 2.2 0 1.52.77 2.86 1.94 3.65A4.48 4.48 0 0 1 .96 6v.06c0 2.13 1.52 3.91 3.54 4.31-.37.1-.76.16-1.16.16-.28 0-.55-.03-.81-.08.55 1.72 2.16 2.97 4.07 3A9.05 9.05 0 0 1 0 19.54a12.8 12.8 0 0 0 6.92 2.03c8.3 0 12.85-6.88 12.85-12.85 0-.2 0-.39-.01-.58A9.22 9.22 0 0 0 24 4.59a9.1 9.1 0 0 1-2.6.71z"/></svg>
        </a>
        <a href="#" aria-label="Facebook" title="Facebook">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a4 4 0 0 0-4 4v3H7v4h4v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h3z"/></svg>
        </a>
      </div>
    </div>
    <div class="footer-copyright">&copy; 2024 E-Shop. All rights reserved.</div>
  `;
}

// Fetch product and related products
async function fetchProductAndRelated() {
  renderLoading();
  const id = getProductId();
  try {
    const [productRes, allRes] = await Promise.all([
      fetch(`https://fakestoreapi.com/products/${id}`),
      fetch('https://fakestoreapi.com/products')
    ]);
    const product = await productRes.json();
    const allProducts = await allRes.json();
    renderProduct(product);
    renderRelated(allProducts, id);
    setupProductEvents(product, allProducts);
  } catch (err) {
    productDetails.innerHTML = '<p class="container">Failed to load product.</p>';
  }
}

// Setup Add to Cart and related product click
function setupProductEvents(product, allProducts) {
  productDetails.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart-btn')) {
      addToCart(product);
    }
  });
  relatedProducts.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if (card) {
      const id = card.getAttribute('data-id');
      window.location.href = `product.html?id=${id}`;
    }
  });
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
  fetchProductAndRelated();
  renderFooter();
});

// --- Loading Spinner & Product Detail CSS (injected for demo) ---
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
.product-detail {
  display: flex;
  gap: 2rem;
  margin: 2rem 0;
  flex-wrap: wrap;
}
.product-detail__img {
  flex: 1 1 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  border-radius: 12px;
  padding: 2rem;
  min-width: 250px;
}
.product-detail__img img {
  max-width: 250px;
  max-height: 300px;
}
.product-detail__info {
  flex: 2 1 350px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.product-detail__price {
  color: var(--primary);
  font-weight: 600;
  font-size: 1.3rem;
}
.product-detail__desc {
  color: var(--text);
  font-size: 1.1rem;
}
.add-to-cart-btn {
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}
.add-to-cart-btn:hover {
  background: var(--accent);
  transform: scale(1.05);
}
@media (max-width: 1023px) {
  .product-detail {
    flex-direction: column;
    align-items: center;
  }
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
`;
document.head.appendChild(style); 