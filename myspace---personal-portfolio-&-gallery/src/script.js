const currentPath = window.location.pathname;
const currentPage = currentPath.split("/").pop() || "index.html";

document.querySelectorAll(".navbar nav a").forEach(link => {
  const href = link.getAttribute("href") || "";
  const targetPage = href.split("/").pop().split("#")[0] || "index.html";
  
  if (
    (currentPage === "" && targetPage === "index.html") ||
    (currentPage === "index.html" && targetPage === "index.html") ||
    (currentPage === targetPage)
  ) {
    link.classList.add("active");
  } else {
    link.classList.remove("active");
  }
});

function getSession() {
  try {
    return JSON.parse(sessionStorage.getItem("myspace_session") || "null");
  } catch {
    return null;
  }
}

function getAccounts() {
  try {
    return JSON.parse(localStorage.getItem("myspace_accounts") || "[]");
  } catch {
    return [];
  }
}

const session = getSession();
const authScreen = document.getElementById("authScreen");
const site = document.getElementById("site");
const welcomeUser = document.getElementById("welcomeUser");
const logoutBtn = document.getElementById("logoutBtn");

if (currentPage !== "" && currentPage !== "index.html") {
  if (!session) {
    window.location.href = "index.html";
  } else {
    if (welcomeUser) welcomeUser.textContent = `Hi, ${session.name}`;
  }
} else {
  if (session) {
    if (authScreen) authScreen.classList.add("hidden");
    if (site) site.classList.remove("hidden");
    if (welcomeUser) welcomeUser.textContent = `Hi, ${session.name}`;
  } else {
    if (authScreen) authScreen.classList.remove("hidden");
    if (site) site.classList.add("hidden");
  }
}

function handleLogout() {
  sessionStorage.removeItem("myspace_session");
  window.location.href = "index.html";
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", handleLogout);
}

document.querySelectorAll(".show-password").forEach(button => {
  button.addEventListener("click", () => {
    const targetId = button.getAttribute("data-target");
    if (!targetId) return;
    const input = document.getElementById(targetId);
    if (!input) return;
    const visible = input.type === "password";
    input.type = visible ? "text" : "password";
    button.textContent = visible ? "Hide" : "Show";
  });
});

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const showSignupBtn = document.getElementById("showSignup");
const showLoginBtn = document.getElementById("showLogin");

function showAuthForm(mode) {
  const signup = mode === "signup";
  if (loginForm) loginForm.classList.toggle("hidden", signup);
  if (signupForm) signupForm.classList.toggle("hidden", !signup);

  const eyebrow = document.getElementById("formEyebrow");
  const title = document.getElementById("formTitle");
  const subtitle = document.getElementById("formSubtitle");
  const loginMsg = document.getElementById("loginMessage");
  const signupMsg = document.getElementById("signupMessage");

  if (eyebrow) eyebrow.textContent = signup ? "START YOUR JOURNEY" : "YOUR PERSONAL SPACE";
  if (title) title.textContent = signup ? "Create account." : "Welcome back.";
  if (subtitle) subtitle.textContent = signup
    ? "Create an account to explore the portfolio."
    : "Sign in to explore my personal website.";
  if (loginMsg) loginMsg.textContent = "";
  if (signupMsg) signupMsg.textContent = "";
}

if (showSignupBtn) showSignupBtn.addEventListener("click", () => showAuthForm("signup"));
if (showLoginBtn) showLoginBtn.addEventListener("click", () => showAuthForm("login"));

if (signupForm) {
  signupForm.addEventListener("submit", event => {
    event.preventDefault();
    const nameEl = document.getElementById("signupName");
    const emailEl = document.getElementById("signupEmail");
    const passwordEl = document.getElementById("signupPassword");
    const message = document.getElementById("signupMessage");

    const name = nameEl ? nameEl.value.trim() : "";
    const email = emailEl ? emailEl.value.trim().toLowerCase() : "";
    const password = passwordEl ? passwordEl.value : "";
    const accounts = getAccounts();

    if (password.length < 6) {
      if (message) message.textContent = "Your password must contain at least 6 characters.";
      return;
    }
    if (accounts.some(account => account.email === email)) {
      if (message) message.textContent = "An account with this email already exists. Please sign in.";
      return;
    }
    accounts.push({ name, email, password });
    localStorage.setItem("myspace_accounts", JSON.stringify(accounts));
    if (message) {
      message.className = "form-message success";
      message.textContent = "Account created! Signing you in...";
    }
    setTimeout(() => {
      sessionStorage.setItem("myspace_session", JSON.stringify({ name, email }));
      if (authScreen) authScreen.classList.add("hidden");
      if (site) site.classList.remove("hidden");
      if (welcomeUser) welcomeUser.textContent = `Hi, ${name}`;
      window.scrollTo(0, 0);
    }, 600);
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", event => {
    event.preventDefault();
    const emailEl = document.getElementById("loginEmail");
    const passwordEl = document.getElementById("loginPassword");
    const message = document.getElementById("loginMessage");

    const email = emailEl ? emailEl.value.trim().toLowerCase() : "";
    const password = passwordEl ? passwordEl.value : "";
    const account = getAccounts().find(item => item.email === email && item.password === password);

    if (!account) {
      if (message) message.textContent = "Incorrect email or password. Create an account first if you're new.";
      return;
    }

    sessionStorage.setItem("myspace_session", JSON.stringify({ name: account.name, email: account.email }));
    if (authScreen) authScreen.classList.add("hidden");
    if (site) site.classList.remove("hidden");
    if (welcomeUser) welcomeUser.textContent = `Hi, ${account.name}`;
    window.scrollTo(0, 0);
  });
}
