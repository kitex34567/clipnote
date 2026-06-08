const API_BASE = 'http://localhost:3000' // Change to production URL after deploy

// Register context menu items on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'clipnote-selection',
    title: 'In ClipNote speichern',
    contexts: ['selection'],
  })
  chrome.contextMenus.create({
    id: 'clipnote-page',
    title: 'Seite in ClipNote speichern',
    contexts: ['page', 'link'],
  })
})

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const { token } = await chrome.storage.local.get('token')
  if (!token) {
    // Open popup to let user sign in
    chrome.action.openPopup()
    return
  }

  let content = ''
  let sourceUrl = null
  let sourceTitle = null
  let type = 'text'

  if (info.menuItemId === 'clipnote-selection') {
    content = info.selectionText ?? ''
    sourceUrl = tab?.url ?? null
    sourceTitle = tab?.title ?? null
    type = 'text'
  } else if (info.menuItemId === 'clipnote-page') {
    const url = info.linkUrl ?? tab?.url ?? ''
    content = url
    sourceUrl = url
    sourceTitle = tab?.title ?? null
    type = 'url'
  }

  if (!content) return

  try {
    const res = await fetch(`${API_BASE}/api/clips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ content, source_url: sourceUrl, source_title: sourceTitle, type }),
    })

    if (res.ok) {
      // Show success notification
      chrome.notifications?.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'ClipNote',
        message: 'Clip gespeichert ✓',
      })
    } else {
      console.error('ClipNote API error:', res.status)
    }
  } catch (err) {
    console.error('ClipNote fetch error:', err)
  }
})

// Listen for token updates from popup
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'SET_TOKEN') {
    chrome.storage.local.set({ token: msg.token })
  }
})
