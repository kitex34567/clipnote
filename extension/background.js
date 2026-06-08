const SUPABASE_URL = 'https://jqudjvbvwqrglulbrycq.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxdWRqdmJ2d3FyZ2x1bGJyeWNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MjQyNTgsImV4cCI6MjA5NjUwMDI1OH0.HeZry8iutYSn9ZxUFNpLfnawrVO155fRwan8Dsn70-A'
const APP_URL = 'https://clipnote-nu.vercel.app'

// Register context menus
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'clipnote-text',
    title: '✂️ In ClipNote speichern',
    contexts: ['selection'],
  })
  chrome.contextMenus.create({
    id: 'clipnote-page',
    title: '✂️ Seite in ClipNote speichern',
    contexts: ['page', 'link'],
  })
})

// Handle context menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const { accessToken } = await chrome.storage.local.get('accessToken')

  if (!accessToken) {
    // Not logged in — open app to log in
    chrome.tabs.create({ url: APP_URL })
    return
  }

  let content = ''
  let sourceUrl = null
  let sourceTitle = null
  let type = 'text'

  if (info.menuItemId === 'clipnote-text') {
    content = info.selectionText ?? ''
    sourceUrl = tab?.url ?? null
    sourceTitle = tab?.title ?? null
    type = 'text'
  } else {
    const url = info.linkUrl ?? tab?.url ?? ''
    content = url
    sourceUrl = url
    sourceTitle = tab?.title ?? null
    type = 'url'
  }

  if (!content.trim()) return

  await saveClip({ content, sourceUrl, sourceTitle, type, accessToken })
})

async function saveClip({ content, sourceUrl, sourceTitle, type, accessToken }) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/clips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${accessToken}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        content,
        source_url: sourceUrl,
        source_title: sourceTitle,
        type,
        tags: [],
      }),
    })

    if (res.ok || res.status === 201) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'ClipNote',
        message: '✓ Clip gespeichert',
      })
    } else {
      const err = await res.text()
      console.error('ClipNote save error:', res.status, err)
      // Token might be expired
      if (res.status === 401) {
        await chrome.storage.local.remove(['accessToken', 'userEmail'])
      }
    }
  } catch (err) {
    console.error('ClipNote network error:', err)
  }
}

// Receive session from content script (after Magic Link login on web app)
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'SESSION_FROM_PAGE' && msg.accessToken) {
    chrome.storage.local.set({
      accessToken: msg.accessToken,
      userEmail: msg.email ?? '',
    })
  }
})
