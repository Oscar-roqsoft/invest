
export default defineNuxtPlugin(() => {
    if (process.client) {
      window.Tawk_API = window.Tawk_API || {}
      window.Tawk_LoadStart = new Date()
  
      const script = document.createElement('script')
  
      script.async = true
      script.src = 'https://embed.tawk.to/6acb3a18d1f80c34c3a2ddb1/1k4ktlsen'
      script.charset = 'UTF-8'
      script.setAttribute('crossorigin', '*')
  
      document.head.appendChild(script)
    }
})

// <!--Start of Tawk.to Script-->
// <script type="text/javascript">
// var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
// (function(){
// var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
// s1.async=true;
// s1.src='https://embed.tawk.to/6acb3a18d1f80c34c3a2ddb1/1k4ktlsen';
// s1.charset='UTF-8';
// s1.setAttribute('crossorigin','*');
// s0.parentNode.insertBefore(s1,s0);
// })();
// </script>
// <!--End of Tawk.to Script-->