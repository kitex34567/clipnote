// Runs on clipnote-nu.vercel.app
// After Magic Link login, Supabase puts the session in localStorage.
// We read it and forward it to the extension background so the popup knows the user is logged in.

(function () {
  function tryExtractSession() {
    // Supabase stores session under this key pattern
    const keys = Object.keys(localStorage).filter(k => k.startsWith('sb-') && k.endsWith('-auth-token'))
    if (!keys.length) return

    const raw = localStorage.getItem(keys[0])
    if (!raw) return

    try {
      const session = JSON.parse(raw)
      const accessToken = session?.access_token
      const email = session?.user?.email
      if (!accessToken) return

      chrome.runtime.sendMessage({ type: 'SESSION_FROM_PAGE', accessToken, email })
    } catch (e) {
      // ignore
    }
  }

  // Try immediately and after a short delay (in case Supabase writes async)
  tryExtractSession()
  setTimeout(tryExtractSession, 1500)
})()
