const authScreen = document.getElementById("authScreen");
const site = document.getElementById("site");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

function showForm(mode) {
  const signup = mode === "signup";
  loginForm.classList.toggle("hidden", signup);
  signupForm.classList.toggle("hidden", !signup);
  document.getElementById("formEyebrow").textContent = signup ? "START YOUR JOURNEY" : "YOUR PERSONAL SPACE";
  document.getElementById("formTitle").textContent = signup ? "Create account." : "Welcome back.";
  document.getElementById("formSubtitle").textContent = signup
    ? "Create an account to explore the portfolio."
    : "Sign in to explore my personal website.";
  document.getElementById("loginMessage").textContent = "";
  document.getElementById("signupMessage").textContent = "";
}

document.getElementById("showSignup").addEventListener("click", () => showForm("signup"));
document.getElementById("showLogin").addEventListener("click", () => showForm("login"));

document.querySelectorAll(".show-password").forEach(button => {
  button.addEventListener("click", () => {
    const input = document.getElementById(button.dataset.target);
    const visible = input.type === "password";
    input.type = visible ? "text" : "password";
    button.textContent = visible ? "Hide" : "Show";
  });
});

function getAccounts() {
  try { return JSON.parse(localStorage.getItem("myspace_accounts") || "[]"); }
  catch { return []; }
}

signupForm.addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim().toLowerCase();
  const password = document.getElementById("signupPassword").value;
  const message = document.getElementById("signupMessage");
  const accounts = getAccounts();

  if (password.length < 6) {
    message.textContent = "Your password must contain at least 6 characters.";
    return;
  }
  if (accounts.some(account => account.email === email)) {
    message.textContent = "An account with this email already exists. Please sign in.";
    return;
  }
  accounts.push({ name, email, password });
  localStorage.setItem("myspace_accounts", JSON.stringify(accounts));
  message.className = "form-message success";
  message.textContent = "Account created! Signing you in...";
  setTimeout(() => enterSite({ name, email }), 650);
});

loginForm.addEventListener("submit", event => {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;
  const message = document.getElementById("loginMessage");
  const account = getAccounts().find(item => item.email === email && item.password === password);

  if (!account) {
    message.textContent = "Incorrect email or password. Create an account first if you're new.";
    return;
  }
  enterSite(account);
});

function enterSite(account) {
  sessionStorage.setItem("myspace_session", JSON.stringify({ name: account.name, email: account.email }));
  authScreen.classList.add("hidden");
  site.classList.remove("hidden");
  document.getElementById("welcomeUser").textContent = `Hi, ${account.name}`;
  window.scrollTo(0, 0);
}

function logout() {
  sessionStorage.removeItem("myspace_session");
  site.classList.add("hidden");
  authScreen.classList.remove("hidden");
  loginForm.reset();
  signupForm.reset();
  showForm("login");
  window.scrollTo(0, 0);
}

document.getElementById("logoutBtn").addEventListener("click", logout);

// Restore the current browser session after a page refresh.
try {
  const session = JSON.parse(sessionStorage.getItem("myspace_session") || "null");
  if (session) enterSite(session);
} catch {
  sessionStorage.removeItem("myspace_session");
}
