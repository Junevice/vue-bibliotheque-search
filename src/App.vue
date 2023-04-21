<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav class="h-28 px-16 flex justify-between items-center">
      <div>
        <h1 class="text-3xl">LookBook</h1>
      </div>

      <ul class="flex gap-8">
        <RouterLink to="/"><li>Accueil</li></RouterLink>
        <RouterLink to="/search"><li>Rechercher un livre</li></RouterLink>
      </ul>
    </nav>
  </header>

  <RouterView />
</template>

