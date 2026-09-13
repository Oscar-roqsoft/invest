
export default defineNuxtPlugin(() => {
    if (process.client) {
      window.Tawk_API = window.Tawk_API || {}
      window.Tawk_LoadStart = new Date()
  
      const script = document.createElement('script')
  
      script.async = true
      script.src = 'https://embed.tawk.to/6a7abdeac010c21d4b633496/1jvnncf9c'
      script.charset = 'UTF-8'
      script.setAttribute('crossorigin', '*')
  
      document.head.appendChild(script)
    }
})