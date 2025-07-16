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