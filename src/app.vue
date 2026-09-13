<template>
    <div>
      <ClientOnly>

        <SonnerToaster
            position="top-right"
            rich-colors
            close-button
        />
        </ClientOnly>

      <!-- Global Loader -->
      <CandlesLoader :visible="isLoading" />
      
      <NuxtLayout>

        <NuxtPage />
      </NuxtLayout>
    </div>
  </template>
  
  <script setup>
  
  const isLoading = ref(false)
  
  // You can control the loader from anywhere using provide/inject or a store
  // Example: show loader when route chan
  const router = useRouter()
  
  router.beforeEach(() => {
    isLoading.value = true
  })
  
  router.afterEach(() => {
    setTimeout(() => {
      isLoading.value = false
    }, 500)
  })
  </script>


<style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Roboto:ital,wght@0,100..900;1,100..900&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap');

/* Prevent Chrome autofill from changing the input background */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-text-fill-color: white !important;
  -webkit-box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0.1) inset !important;
  box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0.1) inset !important;
  transition: background-color 5000s ease-in-out 0s;
}
</style>