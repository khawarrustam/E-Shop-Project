// cart.js - Cart Page JavaScript

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

// --- Cart Page Logic ---
const cartItemsSection = document.getElementById('cart-items');
const cartEmptySection = document.getElementById('cart-empty');
const cartSummarySection = document.getElementById('cart-summary');

// Render cart items as horizontal cards
function renderCart() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cartEmptySection.innerHTML = '';
  if (!cart.length) {
    cartItemsSection.innerHTML = '';
    cartEmptySection.innerHTML = `
      <div id="cart-empty">
        <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="Empty Cart" />
        <div>Your cart is empty.</div>
        <a href="shop.html" class="cart-summary-link">Continue Shopping</a>
      </div>
    `;
    renderSummary([]);
    return;
  }
  // Group by product id for quantity
  const grouped = {};
  cart.forEach(item => {
    if (!grouped[item.id]) grouped[item.id] = {...item, quantity: 0};
    grouped[item.id].quantity++;
  });
  const items = Object.values(grouped);
  cartItemsSection.innerHTML = items.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item__img"><img src="${item.image}" alt="${item.title}" /></div>
      <div class="cart-item__info">
        <div class="cart-item__title">${item.title}</div>
        <div class="cart-item__price">$${item.price.toFixed(2)}</div>
        <div class="cart-item__qty">
          <button class="qty-btn qty-minus" aria-label="Decrease quantity">-</button>
          <span class="cart-item__qty-value">${item.quantity}</span>
          <button class="qty-btn qty-plus" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <button class="cart-item__remove" aria-label="Remove from cart">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
      </button>
    </div>
  `).join('');
  renderSummary(items);
}

// Render order summary
function renderSummary(items) {
  if (!items.length) {
    cartSummarySection.innerHTML = '';
    return;
  }
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartSummarySection.innerHTML = `
    <div class="cart-summary-title">Order Summary</div>
    <div class="cart-summary-row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
    <div class="cart-summary-row"><span>Shipping</span><span>Free</span></div>
    <div class="cart-summary-total"><span>Total</span><span>$${subtotal.toFixed(2)}</span></div>
    <button class="cart-summary-checkout">Checkout</button>
    <a href="shop.html" class="cart-summary-link">Continue Shopping</a>
    <button class="cart-summary-clear">Clear Cart</button>
  `;
}

// Handle quantity, remove, and clear cart
function setupCartEvents() {
  cartItemsSection.addEventListener('click', (e) => {
    const card = e.target.closest('.cart-item');
    if (!card) return;
    const id = card.getAttribute('data-id');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Remove
    if (e.target.closest('.cart-item__remove')) {
      card.style.opacity = 0;
      setTimeout(() => {
        cart = cart.filter(item => item.id != id);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
      }, 400);
    }
    // Quantity +
    if (e.target.classList.contains('qty-plus')) {
      cart.push(cart.find(item => item.id == id));
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
      updateCartCount();
    }
    // Quantity -
    if (e.target.classList.contains('qty-minus')) {
      let idx = cart.findIndex(item => item.id == id);
      if (idx !== -1) {
        cart.splice(idx, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
      }
    }
  });
  // Clear cart
  cartSummarySection.addEventListener('click', (e) => {
    if (e.target.classList.contains('cart-summary-clear')) {
      localStorage.removeItem('cart');
      renderCart();
      updateCartCount();
    }
  });
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

// On DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  injectLayout();
  setupHamburger();
  updateCartCount();
  setupDarkMode();
  renderCart();
  setupCartEvents();
  renderFooter();
});

// --- Cart Page CSS (injected for demo) ---
const style = document.createElement('style');
style.innerHTML = `
.cart-list {
  margin: 2rem 0;
}
.cart-list__items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.cart-item {
  display: flex;
  gap: 1.5rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(37,99,235,0.07);
  padding: 1rem;
  align-items: center;
  transition: box-shadow 0.3s, transform 0.3s;
}
.cart-item__img img {
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: 8px;
  background: #f1f5f9;
}
.cart-item__info {
  flex: 1 1 200px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.remove-cart-btn {
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}
.remove-cart-btn:hover {
  background: #d97706;
  transform: scale(1.05);
}
.cart-list__total {
  margin-top: 2rem;
  text-align: right;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--primary);
}
@media (max-width: 767px) {
  .cart-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  .cart-list__total {
    text-align: left;
  }
}
`;
document.head.appendChild(style); 