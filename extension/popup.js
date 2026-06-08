const SUPABASE_URL  = 'https://jqudjvbvwqrglulbrycq.supabase.co'
const SUPABASE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxdWRqdmJ2d3FyZ2x1bGJyeWNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MjQyNTgsImV4cCI6MjA5NjUwMDI1OH0.HeZry8iutYSn9ZxUFNpLfnawrVO155fRwan8Dsn70-A'

const dot        = document.getElementById('dot')
const statusText = document.getElementById('status-text')
const loginView  = document.getElementById('login-view')
const loggedView = document.getElementById('loggedin-view')
const emailInput = document.getElementById('email')
const loginBtn   = document.getElementById('login-btn')
const logoutBtn  = document.getElementById('logout-btn')
const sentBox    = document.getElementById('sent-box')
const errorBox   = document.getElementById('error-box')
const userEmail  = document.getElementById('user-email')

// Enable button only when email is filled
emailInput.addEventListener('input', () => {
  loginBtn.disabled = !emailInput.value.trim()
})

async function init() {
  const { accessToken, userEmail: storedEmail } = await chrome.storage.local.get(['accessToken', 'userEmail'])
  if (accessToken) {
    showLoggedIn(storedEmail)
  } else {
    showLogin()
  }
}

function showLoggedIn(email) {
  loginView.style.display = 'none'
  loggedView.style.display = 'block'
  userEmail.textContent = email || '–'
  dot.className = 'dot live'
  statusText.textContent = 'Live — Clips werden sofort synchronisiert'
}

function showLogin() {
  loginView.style.display = 'block'
  loggedView.style.display = 'none'
  dot.className = 'dot error'
  statusText.textContent = 'Nicht angemeldet'
}

function showError(msg) {
  errorBox.textContent = '⚠️ ' + msg
  errorBox.style.display = 'block'
}

loginBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim()
  if (!email) return

  loginBtn.disabled = true
  loginBtn.textContent = 'Sende…'
  errorBox.style.display = 'none'

  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
      },
      body: JSON.stringify({
        email,
        create_user: true,
        options: { emailRedirectTo: 'https://clipnote-nu.vercel.app' },
      }),
    })

    if (res.ok) {
      sentBox.style.display = 'block'
      loginBtn.textContent = 'Link gesendet ✓'
    } else {
      const data = await res.json()
      showError(data.message ?? 'Unbekannter Fehler')
      loginBtn.disabled = false
      loginBtn.textContent = 'Magic Link senden'
    }
  } catch (err) {
    showError('Verbindungsfehler')
    loginBtn.disabled = false
    loginBtn.textContent = 'Magic Link senden'
  }
})

logoutBtn.addEventListener('click', async () => {
  await chrome.storage.local.remove(['accessToken', 'userEmail'])
  showLogin()
  sentBox.style.display = 'none'
})

// Live-update wenn content.js das Token schreibt (z.B. nach Magic Link)
chrome.storage.onChanged.addListener((changes) => {
  if (changes.accessToken?.newValue) {
    showLoggedIn(changes.userEmail?.newValue ?? '')
  }
  if (changes.accessToken?.newValue === undefined && 'accessToken' in changes) {
    showLogin()
  }
})

init()
