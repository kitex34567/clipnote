const API_BASE = 'http://localhost:3000'

const statusDot = document.getElementById('status-dot')
const statusText = document.getElementById('status-text')
const loginView = document.getElementById('login-view')
const loggedInView = document.getElementById('logged-in-view')
const emailInput = document.getElementById('email')
const loginBtn = document.getElementById('login-btn')
const logoutBtn = document.getElementById('logout-btn')
const userEmailDisplay = document.getElementById('user-email-display')
const openAppBtn = document.getElementById('open-app-btn')

openAppBtn.href = API_BASE

async function init() {
  const { token, userEmail } = await chrome.storage.local.get(['token', 'userEmail'])
  if (token && userEmail) {
    showLoggedIn(userEmail)
  } else {
    showLogin()
  }
}

function showLoggedIn(email) {
  loginView.style.display = 'none'
  loggedInView.style.display = 'block'
  userEmailDisplay.textContent = email
  statusDot.className = 'dot connected'
  statusText.textContent = 'Verbunden — Clips werden live synchronisiert'
}

function showLogin() {
  loginView.style.display = 'block'
  loggedInView.style.display = 'none'
  statusDot.className = 'dot error'
  statusText.textContent = 'Nicht angemeldet'
}

loginBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim()
  if (!email) return
  loginBtn.textContent = 'Sende Link…'
  loginBtn.disabled = true

  try {
    const res = await fetch(`${API_BASE}/api/auth/magic-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    if (res.ok) {
      statusText.textContent = 'Check deine E-Mails für den Login-Link!'
      statusDot.className = 'dot connected'
      loginBtn.textContent = 'Link gesendet ✓'
    }
  } catch {
    loginBtn.textContent = 'Magic Link senden'
    loginBtn.disabled = false
    statusText.textContent = 'Fehler — App erreichbar?'
  }
})

logoutBtn.addEventListener('click', async () => {
  await chrome.storage.local.remove(['token', 'userEmail'])
  chrome.runtime.sendMessage({ type: 'SET_TOKEN', token: null })
  showLogin()
})

// Listen for token set from auth callback
chrome.storage.onChanged.addListener((changes) => {
  if (changes.token?.newValue && changes.userEmail?.newValue) {
    showLoggedIn(changes.userEmail.newValue)
  }
})

init()
