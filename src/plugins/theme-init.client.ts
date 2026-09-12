export default defineNuxtPlugin(() => {
    if (typeof window === 'undefined') return
    
    const stored = localStorage.getItem('theme')
    const html = document.documentElement
    
    // ALWAYS default to light on refresh unless user chose dark
    if (stored === 'dark') {
      html.classList.add('dark')
      html.classList.remove('light')
      html.setAttribute('data-theme', 'dark')
    } else {
      html.classList.add('light')
      html.classList.remove('dark')
      html.setAttribute('data-theme', 'light')
    }
  })