// main.js - Home Page JavaScript

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

// Navbar HTML
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

// Footer HTML
const footerHTML = `
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
      &copy; 2024 E-Shop. All rights reserved.
    </div>
  </div>
`;

// Inject Navbar and Footer
function injectLayout() {
  const navbar = document.getElementById('navbar');
  if (navbar) navbar.innerHTML = getNavbarHTML();
  const footer = document.getElementById('footer');
  if (footer) footer.innerHTML = footerHTML;
}

// Setup hamburger menu and logout
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

// Update cart count from LocalStorage
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  document.getElementById('cart-count').textContent = cart.length;
}

// Dark mode toggle (placeholder)
function setupDarkMode() {
  const btn = document.getElementById('darkmode-toggle');
  if (btn) {
    btn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
    });
  }
}

// --- Home Page Logic ---

// Fade-in animation for hero, categories, and featured
function fadeInOnLoad() {
  const hero = document.querySelector('.hero-content');
  if (hero) hero.classList.add('fade-in');
  document.querySelectorAll('.category-card').forEach((el, i) => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(40px)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.8s, transform 0.8s';
      el.style.opacity = 1;
      el.style.transform = 'translateY(0)';
    }, 200 + i * 120);
  });
}

// IntersectionObserver for fade-in on scroll (product/category cards)
function setupFadeInOnScroll() {
  const observer = new window.IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.product-card, .shop-product-card, .category-card').forEach(card => {
    card.style.opacity = 0;
    card.style.transform = 'translateY(40px)';
    observer.observe(card);
  });
}

// Render Hero Section
function renderHero() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  hero.innerHTML = `
    <div class="hero-bg">
      <div class="hero-overlay"></div>
      <div class="hero-content container">
        <h1>Discover Modern Products</h1>
        <p>Shop the latest trends in fashion, electronics, and more.</p>
        <a href="shop.html" class="hero-btn">Shop Now</a>
      </div>
    </div>
  `;
}

// --- Featured Categories Data from API ---
const apiCategoryImages = {
  "electronics": "https://img.freepik.com/free-photo/modern-stationary-collection-arrangement_23-2149309649.jpg?semt=ais_hybrid&w=740",
  "jewelery": "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
  "men's clothing": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
  "women's clothing": "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg"
};
const featuredCategories = [
  {
    name: "Electronics",
    image: apiCategoryImages["electronics"],
    filter: "electronics"
  },
  {
    name: "Jewelery",
    image: apiCategoryImages["jewelery"],
    filter: "jewelery"
  },
  {
    name: "Men's Clothing",
    image: apiCategoryImages["men's clothing"],
    filter: "men's clothing"
  },
  {
    name: "Women's Clothing",
    image: apiCategoryImages["women's clothing"],
    filter: "women's clothing"
  }
];

function renderFeaturedCategories() {
  const grid = document.getElementById('categories-grid');
  if (!grid) return;
  grid.innerHTML = '';
  featuredCategories.forEach((cat, i) => {
    const card = document.createElement('div');
    card.className = 'category-card fade-in';
    card.style.animationDelay = `${i * 0.1 + 0.2}s`;
    card.innerHTML = `
      <div class="category-img" style="background-image:url('${cat.image}')">
        <div class="category-overlay"></div>
        <div class="category-text">
          <span class="category-name">${cat.name}</span>
          <span class="shop-now">Shop Now</span>
        </div>
      </div>
    `;
    card.addEventListener('click', () => {
      window.location.href = `shop.html?category=${encodeURIComponent(cat.filter)}`;
    });
    grid.appendChild(card);
  });
}

// Fetch and render featured products
async function renderFeaturedProducts() {
  const featuredList = document.getElementById('featured-list');
  if (!featuredList) return;
  featuredList.innerHTML = '<div class="loading-spinner"></div>';
  try {
    const res = await fetch('https://fakestoreapi.com/products?limit=4');
    const products = await res.json();
    featuredList.innerHTML = `
      ${products.map((product, i) => `
        <div class="product-card" style="animation-delay:${0.1 + i * 0.1}s">
          <div class="product-card__img">
            <img src="${product.image}" alt="${product.title}" loading="lazy" />
          </div>
          <div class="product-card__info">
            <div class="product-card__title">${product.title}</div>
            <div class="product-card__price">$${product.price.toFixed(2)}</div>
            <a href="product.html?id=${product.id}" class="add-to-cart-btn">Add to Cart</a>
          </div>
        </div>
      `).join('')}
    `;
  } catch (err) {
    featuredList.innerHTML = '<p>Failed to load featured products.</p>';
  }
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
    <div class="footer-copyright">&copy; 2024 E-Shop. All rights reserved.</div>
  `;
}

// On DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  injectLayout();
  setupHamburger();
  updateCartCount();
  setupDarkMode();
  if (document.getElementById('hero')) {
    renderHero();
    renderFeaturedProducts();
    fadeInOnLoad();
    setTimeout(setupFadeInOnScroll, 800);
  }
  renderFeaturedCategories();
  renderFooter();
});

// --- Home Page CSS (injected for demo) ---
const style = document.createElement('style');
style.innerHTML = `
.hero-bg {
  position: relative;
  min-height: 350px;
  background: url('https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hero-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(37,99,235,0.45);
  z-index: 1;
}
.hero-content {
  position: relative;
  z-index: 2;
  color: #fff;
  text-align: center;
  padding: 4rem 0 3rem 0;
}
.hero-content h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}
.hero-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}
.hero-btn {
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s, transform 0.2s;
  box-shadow: 0 2px 8px rgba(37,99,235,0.10);
}
.hero-btn:hover {
  background: var(--primary);
  transform: scale(1.05);
}
.categories-list {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}
.category-card {
  background: var(--primary);
  color: #fff;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(37,99,235,0.10);
  transition: background 0.2s, transform 0.2s;
  cursor: pointer;
}
.category-card:hover {
  background: var(--accent);
  transform: scale(1.05);
}
.fade-in {
  opacity: 0;
  animation: fadeIn 1.2s ease forwards;
}
@keyframes fadeIn {
  to { opacity: 1; }
}
`;
document.head.appendChild(style); 