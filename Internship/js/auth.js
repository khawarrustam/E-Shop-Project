// auth.js - Login & Signup JavaScript

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

// --- Auth Logic ---
const signupFormSection = document.getElementById('signup-form');
const loginFormSection = document.getElementById('login-form');

// Render Sign Up Form
function renderSignupForm() {
  if (!signupFormSection) return;
  signupFormSection.innerHTML = `
    <form class="auth-form fade-in" id="signupForm">
      <h2>Sign Up</h2>
      <input type="text" id="signup-name" placeholder="Name" required />
      <input type="email" id="signup-email" placeholder="Email" required />
      <input type="password" id="signup-password" placeholder="Password (min 6 chars)" required />
      <button type="submit">Sign Up</button>
      <div class="auth-message" id="signup-message"></div>
    </form>
  `;
}
// Render Login Form
function renderLoginForm() {
  if (!loginFormSection) return;
  loginFormSection.innerHTML = `
    <form class="auth-form fade-in" id="loginForm">
      <h2>Login</h2>
      <input type="email" id="login-email" placeholder="Email" required />
      <input type="password" id="login-password" placeholder="Password" required />
      <button type="submit">Login</button>
      <div class="auth-message" id="login-message"></div>
    </form>
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

// Sign Up Handler
function setupSignup() {
  const form = document.getElementById('signupForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const message = document.getElementById('signup-message');
    // Basic validation
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      message.textContent = 'Invalid email format.';
      message.style.color = 'red';
      return;
    }
    if (password.length < 6) {
      message.textContent = 'Password must be at least 6 characters.';
      message.style.color = 'red';
      return;
    }
    // Store user in LocalStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find(u => u.email === email)) {
      message.textContent = 'Email already registered.';
      message.style.color = 'red';
      return;
    }
    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    message.textContent = 'Sign up successful! You can now log in.';
    message.style.color = 'green';
    form.reset();
  });
}
// Login Handler
function setupLogin() {
  const form = document.getElementById('loginForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const message = document.getElementById('login-message');
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      message.textContent = 'Invalid email or password.';
      message.style.color = 'red';
      return;
    }
    message.textContent = 'Login successful! Redirecting...';
    message.style.color = 'green';
    form.reset();
    
    // Set logged-in user
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    
    // Restore user's cart data if it exists
    const userCart = localStorage.getItem(`cart_${user.email}`);
    if (userCart) {
      localStorage.setItem('cart', userCart);
    } else {
      // Clear any existing cart if user has no saved cart
      localStorage.removeItem('cart');
    }
    
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  injectLayout();
  setupHamburger();
  updateCartCount();
  setupDarkMode();
  if (signupFormSection) {
    renderSignupForm();
    setupSignup();
  }
  if (loginFormSection) {
    renderLoginForm();
    setupLogin();
  }
  renderFooter();
});

// --- Auth Page CSS (injected for demo) ---
const style = document.createElement('style');
style.innerHTML = `
.auth-form {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(37,99,235,0.07);
  padding: 2rem 2.5rem;
  max-width: 400px;
  margin: 3rem auto 2rem auto;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  align-items: stretch;
}
.auth-form h2 {
  color: var(--primary);
  margin-bottom: 0.5rem;
}
.auth-form input {
  padding: 0.7rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
}
.auth-form input:focus {
  border: 1.5px solid var(--primary);
}
.auth-form button {
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.7rem 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}
.auth-form button:hover {
  background: var(--accent);
  transform: scale(1.05);
}
.auth-message {
  min-height: 1.2em;
  font-size: 1rem;
  margin-top: 0.2rem;
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