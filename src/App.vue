<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Loader from './components/Loader.vue'
</script>

<template>
  <header>
    <nav class="h-28 px-16 flex justify-between items-center">
      <RouterLink to="/">
        <!-- Designer un logo -->
        <img src="/Logo.png" alt="logo" class="w-40">
      </RouterLink>

      <ul class="flex gap-12 text-lg">
        <RouterLink to="/"><li>Accueil</li></RouterLink>
        <RouterLink to="/search-book"><li>Rechercher un livre</li></RouterLink>
        <RouterLink to="/search-author"><li>Rechercher un auteur</li></RouterLink>
      </ul>
    </nav>
  </header>

  <RouterView v-slot="{ Component }">
    <Transition name="slide-fade" mode="out-in">
      <component :is="Component"/>
    </Transition>
  </RouterView>
  
  <Loader />
  
</template>

<style>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
  transition-delay: 0.3s;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>