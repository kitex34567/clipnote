const APP_URL = 'https://clipnote-nu.vercel.app'

const dot        = document.getElementById('dot')
const statusText = document.getElementById('status-text')
const loginView  = document.getElementById('loggedin-view')
const logoutBtn  = document.getElementById('logout-btn')
const userEmailEl = document.getElementById('user-email')
const openAppBtn = document.getElementById('open-app-btn')

async function init() {
  const { accessToken, userEmail } = await chrome.storage.local.get(['accessToken', 'userEmail'])
  if (accessToken) {
    showLoggedIn(userEmail)
  } else {
    showNotLoggedIn()
  }
}

function showLoggedIn(email) {
  document.getElementById('login-view').style.display = 'none'
  loginView.style.display = 'block'
  userEmailEl.textContent = email || '–'
  dot.className = 'dot live'
  statusText.textContent = 'Live — Clips werden sofort synchronisiert'
}

function showNotLoggedIn() {
  document.getElementById('login-view').style.display = 'block'
  loginView.style.display = 'none'
  dot.className = 'dot error'
  statusText.textContent = 'Nicht angemeldet'
}

// Login: einfach die Web-App öffnen, content.js holt das Token automatisch
document.getElementById('open-login-btn').addEventListener('click', () => {
  chrome.tabs.create({ url: APP_URL })
  window.close()
})

logoutBtn.addEventListener('click', async () => {
  await chrome.storage.local.remove(['accessToken', 'userEmail'])
  showNotLoggedIn()
})

// Wenn content.js das Token nach Login schreibt
chrome.storage.onChanged.addListener((changes) => {
  if (changes.accessToken?.newValue) {
    showLoggedIn(changes.userEmail?.newValue ?? '')
  }
  if (!changes.accessToken?.newValue && 'accessToken' in changes) {
    showNotLoggedIn()
  }
})

init()
