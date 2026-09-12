<template>
    <section id="ctas-section" class="relative">
      <div class="ctas-section-container py-12 md:py-16 bg-primary-900">
        <div class="container-custom">
          <div class="flex justify-center">
            <video 
              width="700" 
              class="max-w-full h-auto rounded-lg shadow-2xl"
              controls 
              preload="metadata"
              poster="/that-image.png"
            >
              <source src="/coinsquare.mp4" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
      <div class="background-overlay-mobile"></div>
    </section>
</template>