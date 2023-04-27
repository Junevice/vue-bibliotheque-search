<template>
  <main class="px-32 py-8 min-h-screen flex flex-col justify-between">
    <div class="w-full flex gap-20 my-8">

      <div class="w-1/2 flex flex-col gap-8 justify-center">
        <h2 class="text-3xl">Find Your Next Read</h2>
        <p class="text-lg">Looking for your next favorite book or author? LookBook makes it easy to search, discover, and learn more about the books and authors you love.</p>
        <p class="text-lg">LookBook is a web app that allows you to search for books and authors and get information about them, including summaries, reviews, and author biographies. With LookBook, you can easily find your next read and discover new authors to love.</p>
        <RouterLink to="/search-book" class="w-40 bg-black/80 text-white px-4 py-2 rounded-md">
          <button class="w-full text-center">Get Started</button>
        </RouterLink>
      </div>
      
      <div class="w-1/2">
        <img src="/library.jpg" alt="library" class="rounded-md">
      </div>

    </div>

    <div class="text-center flex flex-col justify-center items-center mt-20 gap-1">
      <p>Powered for a school work at Ynov Bordeaux by <span class="font-semibold">Rémy Lecomte</span>.</p>
      <p>Supervised by <span class="font-semibold">Romain Vergé</span></p>
    </div>

  </main>
</template>

<script setup lang="ts">

import { RouterLink } from 'vue-router';

</script>
